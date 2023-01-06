import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { parse } from 'cookie';
import { Server, Socket } from 'socket.io';
import { BALL_SPEED } from 'src/game/config/game-config';
import { GamePhase, GameRoom, Player } from 'src/game/game.object';
import { GameService } from 'src/game/game.service';
import { PrismaService } from 'src/prisma/prisma.service';

enum Presence {
  ONLINE = 1,
  INGAME = 2,
}

@WebSocketGateway({ cors: { origin: '*' } })
export class UsersGateway {
  public userIdToPresence: Map<string, Presence>;
  public userIdToGameRoomId: Map<string, string>;
  private readonly gameRooms: Map<string, GameRoom>;

  constructor(
    private readonly gameService: GameService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {
    this.userIdToPresence = new Map<string, Presence>();
    this.userIdToGameRoomId = new Map<string, string>();
    this.gameRooms = new Map<string, GameRoom>();
  }

  @WebSocketServer()
  private readonly server!: Server;

  async handleConnection(@ConnectedSocket() socket: Socket): Promise<void> {
    const cookie: string | undefined = socket.handshake.headers.cookie;
    if (cookie === undefined) {
      throw new UnauthorizedException();
    }
    const { accessToken } = parse(cookie);
    const payload = this.jwt.verify<{ id: string }>(accessToken, {
      secret: this.config.get('JWT_SECRET'),
    });
    const { id } = payload;
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user === null) {
      throw new UnauthorizedException();
    }
    socket.data.userId = user.id;

    await socket.join(user.id);

    socket.emit('connect_established');
    Logger.debug('connected: ' + socket.id);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<void> {
    const { userId } = socket.data as { userId: string };
    await socket.leave(userId);
    await socket.leave('matching');
    await this.leaveGameRoom(socket);

    const userIdSockets = await this.server.in(userId).fetchSockets();
    if (userIdSockets.length === 0) {
      this.deletePresence(userId);
    }

    Logger.debug('disconnected: ' + socket.id);
  }

  @SubscribeMessage('handshake')
  handshake(@ConnectedSocket() socket: Socket): {
    userIdToPresence: Array<[string, Presence]>;
    userIdToGameRoomId: Array<[string, string]>;
  } {
    const { userId } = socket.data as { userId: string };
    const reconnected = this.userIdToPresence.has(userId);
    if (!reconnected) {
      this.addPresence(userId);
    }

    Logger.debug('handshake: ' + socket.id);

    return {
      userIdToPresence: [...this.userIdToPresence],
      userIdToGameRoomId: [...this.userIdToGameRoomId],
    };
  }

  @SubscribeMessage('join_matching_room')
  async randomMatch(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} join_matching_room`
    );

    const { userId } = socket.data as { userId: string };
    const gameRoomId = this.userIdToGameRoomId.get(userId);
    if (gameRoomId !== undefined) {
      socket.emit('go_game_room', gameRoomId);

      return;
    }

    const matchingSockets = await this.server.in('matching').fetchSockets();
    // 1人目の場合2人目ユーザーを待つ
    if (matchingSockets.length === 0) {
      await socket.join('matching');

      return;
    }
    const { userId: waitUserId } = matchingSockets[0].data as {
      userId: string;
    };
    if (userId === waitUserId) {
      await socket.join('matching');

      return;
    }

    const player1 = new Player(waitUserId, true);
    const player2 = new Player(userId, false);
    const gameRoom = this.createGameRoom(player1, player2, BALL_SPEED);

    // matchingルームで待っているPlayer1に対してのemit
    this.server.to('matching').emit('go_game_room', gameRoom.id);
    this.server.socketsLeave('matching');

    // Player2に対してのemit
    socket.emit('go_game_room', gameRoom.id);
  }

  @SubscribeMessage('leave_matching_room')
  async cancelMatching(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} leave_matching_room`
    );

    await socket.leave('matching');
  }

  @SubscribeMessage('invitation_match')
  invitationMatch(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: { opponentId: string; ballSpeed: number }
  ): void {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} invitation_match`
    );

    const { userId } = socket.data as { userId: string };
    const player1 = new Player(userId, true);
    const player2 = new Player(message.opponentId, false);
    const gameRoom = this.createGameRoom(player1, player2, message.ballSpeed);
    this.server.to(player2.id).emit('receive_invitation', {
      roomId: gameRoom.id,
      challengerId: player1.id,
    });
  }

  @SubscribeMessage('accept_invitation')
  accept_invitation(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: { roomId: string }
  ): void {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} accept_invitation`
    );
    const gameRoom = this.gameRooms.get(message.roomId);
    if (gameRoom !== undefined) {
      this.server
        .to(gameRoom.player1.id)
        .emit('go_game_room_by_invitation', message.roomId);
    }
  }

  @SubscribeMessage('decline_invitation')
  async decline_invitation(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: { roomId: string }
  ): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} decline_invitation`
    );
    const gameRoom = this.gameRooms.get(message.roomId);
    if (gameRoom !== undefined) {
      this.server.to(gameRoom.player1.id).emit('player2_decline_invitation');
    }
    await this.leaveGameRoom(socket);
  }

  @SubscribeMessage('join_game_room')
  async joinRoom(
    @MessageBody() message: { roomId: string },
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    Logger.debug(`${socket.id} ${socket.data.userId as string} join_game_room`);

    const { roomId } = message;
    const gameRoom = this.gameRooms.get(roomId);
    if (gameRoom === undefined) {
      socket.emit('game_room_error', 'Invalid game room.');

      return;
    }
    socket.data.roomId = roomId;

    const { userId } = socket.data as { userId: string };
    const { player1, player2 } = gameRoom;
    const isPlayer = player1.id === userId || player2.id === userId;
    await (isPlayer ? socket.join(roomId) : socket.join(`watch_${roomId}`));

    const gameInfo = {
      player1: { id: player1.id, score: player1.score },
      player2: { id: player2.id, score: player2.score },
      isPlayer,
      isLeftSide: true,
      readyCountDownNum: gameRoom.readyCountDownNum,
      nextGamePhase: GamePhase.ConfirmWaiting,
    };
    if (isPlayer) {
      const [me, opponent] =
        player1.id === userId ? [player1, player2] : [player2, player1];
      gameInfo.isLeftSide = me.isLeftSide;
      const judgeGamePhase = (): GamePhase => {
        if (!me.isReady) return GamePhase.ConfirmWaiting;
        else if (!opponent.isReady) return GamePhase.OpponentWaiting;
        else if (!gameRoom.isFinished) return GamePhase.InGame;
        else return GamePhase.Result;
      };
      gameInfo.nextGamePhase = judgeGamePhase();
    } else {
      const judgeGamePhase = (): GamePhase => {
        if (!gameRoom.isInGame) return GamePhase.PlayerWaiting;
        if (!gameRoom.isFinished) return GamePhase.Watch;
        else return GamePhase.Result;
      };
      gameInfo.nextGamePhase = judgeGamePhase();
    }

    socket.emit('set_game_info', gameInfo);
  }

  @SubscribeMessage('player_confirm')
  confirm(@ConnectedSocket() socket: Socket): void {
    Logger.debug(`${socket.id} ${socket.data.userId as string} player_confirm`);

    const { userId, roomId } = socket.data as {
      userId: string;
      roomId: string;
    };
    const gameRoom = this.gameRooms.get(roomId);
    if (gameRoom === undefined) {
      socket.emit('game_room_error', 'Invalid game room.');

      return;
    }

    const { player1, player2 } = gameRoom;
    const [me, opponent] =
      player1.id === userId ? [player1, player2] : [player2, player1];
    me.isReady = true;
    if (!opponent.isReady) {
      this.server
        .to(me.id)
        .emit('update_game_phase', GamePhase.OpponentWaiting);
    } else {
      this.server.in(roomId).emit('update_game_phase', GamePhase.InGame);
      this.server
        .in(`watch_${roomId}`)
        .emit('update_game_phase', GamePhase.Watch);
      // 1回のみ動かす
      if (!gameRoom.isInGame) {
        gameRoom.isInGame = true;
        gameRoom.gameStart(roomId);
      }
    }
  }

  // キー入力されたときに呼ばれる。
  @SubscribeMessage('user_command')
  handleUserCommands(
    @MessageBody()
    message: {
      userCommand: { up: boolean; down: boolean; isLeftSide: boolean };
    },
    @ConnectedSocket() socket: Socket
  ): void {
    const { roomId } = socket.data as { roomId: string };
    const gameRoom = this.gameRooms.get(roomId);
    if (gameRoom === undefined) {
      socket.emit('game_room_error', 'Invalid game room.');

      return;
    }
    gameRoom.handleInput(message.userCommand);
  }

  @SubscribeMessage('leave_game_room')
  async handleLeaveGameRoom(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} leave_game_room`
    );

    await this.leaveGameRoom(socket);
  }

  @SubscribeMessage('join_monitor_room')
  async sendAllGameRoomIds(
    @ConnectedSocket() socket: Socket
  ): Promise<string[][]> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} join_monitor_room`
    );

    await socket.join('monitor');
    const inGameOutlines: string[][] = [];
    this.gameRooms.forEach((gameRoom) => {
      if (gameRoom.isFinished) return;
      inGameOutlines.push([
        gameRoom.id,
        gameRoom.player1.id,
        gameRoom.player2.id,
      ]);
    });

    return inGameOutlines;
  }

  @SubscribeMessage('leave_monitor_room')
  async leaveRoomList(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} leave_monitor_room`
    );

    await socket.leave('monitor');
  }

  async leaveGameRoom(socket: Socket): Promise<void> {
    const { userId, roomId } = socket.data as {
      userId: string;
      roomId: string | undefined;
    };
    if (roomId === undefined) {
      return;
    }
    socket.data.roomId = undefined;
    const gameRoom = this.gameRooms.get(roomId);
    if (gameRoom === undefined) {
      return;
    }
    const { player1, player2 } = gameRoom;
    const isPlayer = player1.id === userId || player2.id === userId;
    await (isPlayer ? socket.leave(roomId) : socket.leave(`watch_${roomId}`));
    const gameRoomSockets = await this.server.in(roomId).fetchSockets();
    if (gameRoomSockets.length === 0) {
      // 両プレイヤーゲームルームを抜けたら無効試合
      if (!gameRoom.isFinished) {
        this.server
          .in(`watch_${roomId}`)
          .emit('game_room_error', 'Both players disconnected.');
        clearInterval(gameRoom.interval);
        this.deleteGameRoom(gameRoom);
      }
    }
  }

  createGameRoom(
    player1: Player,
    player2: Player,
    ballSpeed?: number
  ): GameRoom {
    const gameRoom = new GameRoom(
      this.gameService,
      this.server,
      (gameRoom: GameRoom) => this.deleteGameRoom(gameRoom),
      player1,
      player2,
      ballSpeed
    );
    this.gameRooms.set(gameRoom.id, gameRoom);

    this.updatePresence(player1.id, Presence.INGAME);
    this.addGameRoomId(player1.id, gameRoom.id);
    this.updatePresence(player2.id, Presence.INGAME);
    this.addGameRoomId(player2.id, gameRoom.id);
    this.server
      .to('monitor')
      .emit('game_room_created', [gameRoom.id, player1.id, player2.id]);

    return gameRoom;
  }

  deleteGameRoom(gameRoom: GameRoom): void {
    const { id: roomId, player1, player2 } = gameRoom;

    this.gameRooms.delete(roomId);
    this.updatePresence(player1.id, Presence.ONLINE);
    this.updatePresence(player2.id, Presence.ONLINE);
    this.deleteGameRoomId(player1.id);
    this.deleteGameRoomId(player2.id);
    this.server.to('monitor').emit('game_room_deleted', roomId);
  }

  addPresence(userId: string): void {
    const isInGame = this.userIdToGameRoomId.has(userId);
    const presence = isInGame ? Presence.INGAME : Presence.ONLINE;
    this.userIdToPresence.set(userId, presence);
    this.server.emit('set_presence', [
      userId,
      this.userIdToPresence.get(userId),
    ]);
  }

  updatePresence(userId: string, presence: Presence): void {
    const isOnline = this.userIdToPresence.has(userId);
    if (isOnline) {
      this.userIdToPresence.set(userId, presence);
      this.server.emit('set_presence', [
        userId,
        this.userIdToPresence.get(userId),
      ]);
    }
  }

  deletePresence(userId: string): void {
    this.userIdToPresence.delete(userId);
    this.server.emit('delete_presence', userId);
  }

  addGameRoomId(userId: string, gameRoomId: string): void {
    this.userIdToGameRoomId.set(userId, gameRoomId);
    this.server.emit('set_game_room_id', [
      userId,
      this.userIdToGameRoomId.get(userId),
    ]);
  }

  deleteGameRoomId(userId: string): void {
    this.userIdToGameRoomId.delete(userId);
    this.server.emit('delete_game_room_id', userId);
  }
}
