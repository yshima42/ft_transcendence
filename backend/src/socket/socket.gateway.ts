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
import { v4 as uuidv4 } from 'uuid';

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

  // オンラインステータス関連
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
      socket.broadcast.emit('user_disconnected', userId);
      this.userIdToPresence.delete(userId);
      this.userIdToGameRoomId.delete(userId);
    }

    // debug用
    Logger.debug('disconnected: ' + socket.id);
  }

  @SubscribeMessage('handshake')
  handshake(@ConnectedSocket() socket: Socket): {
    userIdToPresence: Array<[string, Presence]>;
    userIdToGameRoomId: Array<[string, string]>;
  } {
    const { userId } = socket.data as { userId: string };
    const reconnected = this.userIdToPresence.has(userId);
    // TODO: ここをthis.updatePresenceにまとめられないか
    if (!reconnected) {
      socket.broadcast.emit('update_presence', [
        userId,
        this.userIdToPresence.get(userId),
      ]);
      socket.broadcast.emit('update_game_room_id', [
        userId,
        this.userIdToGameRoomId.get(userId),
      ]);
    }
    this.userIdToPresence.set(userId, Presence.ONLINE);
    this.userIdToGameRoomId.set(userId, '');

    // debug用
    Logger.debug('handshake: ' + socket.id);

    return {
      userIdToPresence: [...this.userIdToPresence],
      userIdToGameRoomId: [...this.userIdToGameRoomId],
    };
  }

  // Game関連
  @SubscribeMessage('random_match')
  async randomMatch(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(`${socket.id} ${socket.data.userId as string} random_match`);

    const matchingSockets = await this.server.in('matching').fetchSockets();
    // 1人目の場合2人目ユーザーを待つ
    if (matchingSockets.length === 0) {
      await socket.join('matching');

      return;
    }
    const { userId } = socket.data as { userId: string };
    const { userId: waitUserId } = matchingSockets[0].data as {
      userId: string;
    };
    if (userId === waitUserId) {
      await socket.join('matching');

      return;
    }

    const player1 = new Player(waitUserId, true);
    const player2 = new Player(userId, false);
    // 2人揃ったらマッチルーム作る
    const newRoomId = this.createGameRoom(player1, player2, BALL_SPEED);
    this.server.to('matching').emit('go_game_room', newRoomId);
    this.server.socketsLeave('matching');
    socket.emit('go_game_room', newRoomId);
    this.server
      .to('monitor')
      .emit('game_room_created', [newRoomId, player1.id, player2.id]);
  }

  createGameRoom(player1: Player, player2: Player, ballSpeed: number): string {
    const id = uuidv4();
    const gameRoom = new GameRoom(
      this.gameService,
      id,
      this.server,
      player1,
      player2,
      ballSpeed
    );
    this.gameRooms.set(id, gameRoom);

    return id;
  }

  updatePresence(userId: string, presence: Presence): void {
    this.userIdToPresence.set(userId, presence);
    this.server.emit('update_presence', [
      userId,
      this.userIdToPresence.get(userId),
    ]);
  }

  updateGameRoomId(userId: string, gameRoomId: string): void {
    this.userIdToGameRoomId.set(userId, gameRoomId);
    this.server.emit('update_game_room_id', [
      userId,
      this.userIdToGameRoomId.get(userId),
    ]);
  }

  @SubscribeMessage('matching_cancel')
  async cancelMatching(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} matching_cancel`
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
    const newRoomId = this.createGameRoom(player1, player2, message.ballSpeed);
    this.server.to(player2.id).emit('receive_invitation', {
      roomId: newRoomId,
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

  // room関連;
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
      isLeftSide: true,
      readyCountDownNum: gameRoom.readyCountDownNum,
      nextGamePhase: GamePhase.ConfirmWaiting,
    };
    if (isPlayer) {
      this.updatePresence(userId, Presence.INGAME);
      this.updateGameRoomId(userId, gameRoom.id);
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
    }
  }

  @SubscribeMessage('connect_pong')
  connectPong(@ConnectedSocket() socket: Socket): void {
    Logger.debug(`${socket.id} ${socket.data.userId as string} connect_pong`);

    const { roomId } = socket.data as { roomId: string };
    const gameRoom = this.gameRooms.get(roomId);
    if (gameRoom === undefined) {
      socket.emit('game_room_error', 'Invalid game room.');

      return;
    }

    // １回のみ動かす
    if (!gameRoom.isInGame) {
      gameRoom.isInGame = true;
      gameRoom.gameStart(socket, roomId);
    }
  }

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
    gameRoom.handleInput(roomId, message.userCommand);
  }

  @SubscribeMessage('leave_game_room')
  async handleLeaveGameRoom(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} leave_game_room`
    );

    await this.leaveGameRoom(socket);
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
      if (!gameRoom.isFinished) {
        // 観戦者を追い出す
        this.server
          .in(`watch_${roomId}`)
          .emit('game_room_error', 'Both players disconnected.');
        clearInterval(gameRoom.interval);
      }
      this.updatePresence(player1.id, Presence.ONLINE);
      this.updatePresence(player2.id, Presence.ONLINE);
      this.updateGameRoomId(player1.id, '');
      this.updateGameRoomId(player2.id, '');
      this.server.socketsLeave(roomId);
      this.server.socketsLeave(`watch_${roomId}`);
      this.gameRooms.delete(roomId);
      this.server.to('monitor').emit('game_room_deleted', roomId);
    }
  }

  @SubscribeMessage('join_game_monitor_room')
  async sendAllGameRoomIds(
    @ConnectedSocket() socket: Socket
  ): Promise<string[][]> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} join_game_monitor_room`
    );

    await socket.join('monitor');
    const inGameOutlines: string[][] = [];
    this.gameRooms.forEach((gameRoom) => {
      inGameOutlines.push([
        gameRoom.id,
        gameRoom.player1.id,
        gameRoom.player2.id,
      ]);
    });

    return inGameOutlines;
  }

  @SubscribeMessage('leave_game_monitor_room')
  async leaveRoomList(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} leave_game_monitor_room`
    );

    await socket.leave('monitor');
  }
}
