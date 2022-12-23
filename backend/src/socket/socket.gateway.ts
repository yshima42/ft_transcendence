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
import { GameRoom, Player } from 'src/game/game.object';
import { GameService } from 'src/game/game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

enum Presence {
  ONLINE = 1,
  INGAME = 2,
}

@WebSocketGateway({ cors: { origin: '*' } })
export class UsersGateway {
  // TODO: userIdToSocketIdsにする(全てuserIdに紐づく構造にするため)
  public socketIdToUserId: Map<string, string>;
  public userIdToPresence: Map<string, Presence>;
  private readonly gameRooms: Map<string, GameRoom>;

  constructor(
    private readonly gameService: GameService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {
    this.socketIdToUserId = new Map<string, string>();
    this.userIdToPresence = new Map<string, Presence>();
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
    socket.data.userNickname = user.nickname;

    await socket.join(user.id);

    socket.emit('connect_established');
    Logger.debug('connected: ' + socket.id);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<void> {
    const { userId } = socket.data as { userId: string };
    this.socketIdToUserId.delete(socket.id);
    if (this.countConnectionByUserId(userId) === 0) {
      socket.broadcast.emit('user_disconnected', userId);
      this.userIdToPresence.delete(userId);
    }

    // disconnect されたら、room からも自動で消えるため、一旦コメントアウト
    // await socket.leave(userId);
    // await socket.leave('matching');
    await this.leaveGameRoom(socket);

    // debug用
    Logger.debug('disconnected: ' + socket.id);
    console.table(this.socketIdToUserId);
  }

  @SubscribeMessage('handshake')
  handshake(@ConnectedSocket() socket: Socket): Array<[string, Presence]> {
    const { userId } = socket.data as { userId: string };
    const reconnected = this.userIdToPresence.has(userId);
    if (!reconnected) {
      socket.broadcast.emit('update_presence', [
        userId,
        this.userIdToPresence.get(userId),
      ]);
    }
    this.socketIdToUserId.set(socket.id, userId);
    this.userIdToPresence.set(userId, Presence.ONLINE);

    // debug用
    Logger.debug('handshake: ' + socket.id);
    console.table(this.socketIdToUserId);

    return [...this.userIdToPresence];
  }

  private readonly countConnectionByUserId = (targetUserId: string): number => {
    const userIds = this.socketIdToUserId.values();
    let count = 0;
    for (const userId of userIds) {
      if (userId === targetUserId) {
        count += 1;
      }
    }

    return count;
  };

  // Game関連
  @SubscribeMessage('random_match')
  async randomMatch(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userNickname as string} random_match`
    );

    const { userId, userNickname } = socket.data as {
      userId: string;
      userNickname: string;
    };

    const matchingSockets = await this.server.in('matching').fetchSockets();

    // 1人目の場合2人目ユーザーを待つ
    if (matchingSockets.length === 0) {
      await socket.join('matching');

      return;
    }
    const { userId: waitUserId, userNickname: waitUserNickname } =
      matchingSockets[0].data as { userId: string; userNickname: string };
    if (waitUserId === userId) {
      await socket.join('matching');

      return;
    }

    this.server.socketsLeave('matching');
    const player1 = new Player(waitUserId, waitUserNickname, true);
    const player2 = new Player(userId, userNickname, false);
    // 2人揃ったらマッチルーム作る
    const newRoomId = this.createGameRoom(player1, player2);
    this.server.to(player1.id).emit('go_game_room', newRoomId);
    this.server.to(player2.id).emit('go_game_room', newRoomId);
    this.server
      .to('monitor')
      .emit('room_created', newRoomId, player1.id, player2.id);
  }

  createGameRoom(player1: Player, player2: Player): string {
    const id = uuidv4();
    const gameRoom = new GameRoom(
      this.gameService,
      id,
      this.server,
      player1,
      player2
    );
    this.gameRooms.set(id, gameRoom);

    return id;
  }

  changePresence(userId: string, presence: Presence): void {
    this.userIdToPresence.set(userId, presence);
    this.server.emit('update_presence', [
      userId,
      this.userIdToPresence.get(userId),
    ]);
  }

  @SubscribeMessage('matching_cancel')
  async cancelMatching(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userNickname as string} matching_cancel`
    );

    await socket.leave('matching');
  }

  // room関連;
  @SubscribeMessage('join_room')
  async joinRoom(
    @MessageBody() message: { roomId: string },
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userNickname as string} join_room`
    );

    const { userId } = socket.data as { userId: string };

    const gameRoom = this.gameRooms.get(message.roomId);
    if (gameRoom === undefined) {
      socket.emit('invalid_room');

      return;
    }
    socket.data.roomId = message.roomId;

    const isPlayer =
      gameRoom.player1.id === userId || gameRoom.player2.id === userId;
    // 接続してきたのが観戦者の場合、どっちでもいい
    const [player, opponent] =
      gameRoom.player1.id === userId
        ? [gameRoom.player1, gameRoom.player2]
        : [gameRoom.player2, gameRoom.player1];
    if (isPlayer) {
      // PresenceをINGAMEに変更
      this.changePresence(userId, Presence.INGAME);
    }
    socket.emit('set_side', player.isLeftSide);
    await socket.join(message.roomId);
    if (!player.isReady) {
      socket.emit(isPlayer ? 'check_confirmation' : 'wait_players');
    } else if (!opponent.isReady) {
      socket.emit(isPlayer ? 'wait_opponent' : 'wait_players');
    } else if (!gameRoom.isFinished) {
      socket.emit(isPlayer ? 'start_game' : 'watch_game');
    } else {
      socket.emit('done_game', {
        player1Nickname: gameRoom.player1.nickname,
        player2Nickname: gameRoom.player2.nickname,
        player1Score: gameRoom.player1.score,
        player2Score: gameRoom.player2.score,
      });
    }
  }

  @SubscribeMessage('confirm')
  confirm(@ConnectedSocket() socket: Socket): void {
    Logger.debug(`${socket.id} ${socket.data.userNickname as string} confirm`);

    const { userId, roomId } = socket.data as {
      userId: string;
      roomId: string;
    };
    const gameRoom = this.gameRooms.get(roomId);
    if (gameRoom === undefined) {
      socket.emit('invalid_room');

      return;
    }

    const isPlayer =
      gameRoom.player1.id === userId || gameRoom.player2.id === userId;
    const [player, opponent] =
      gameRoom.player1.id === userId
        ? [gameRoom.player1, gameRoom.player2]
        : [gameRoom.player2, gameRoom.player1];
    player.isReady = true;
    if (!opponent.isReady) {
      this.server.to(player.id).emit('wait_opponent');
    } else {
      this.server.in(roomId).emit(isPlayer ? 'start_game' : 'watch_game');
    }
  }

  @SubscribeMessage('connect_pong')
  connectPong(@ConnectedSocket() socket: Socket): void {
    Logger.debug(
      `${socket.id} ${socket.data.userNickname as string} connect_pong`
    );

    const { roomId } = socket.data as { roomId: string };
    const gameRoom = this.gameRooms.get(roomId);
    if (gameRoom === undefined) {
      socket.emit('invalid_room');

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
      socket.emit('invalid_room');

      return;
    }
    gameRoom.handleInput(roomId, message.userCommand);
  }

  @SubscribeMessage('leave_room')
  async handleLeaveGameRoom(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userNickname as string} leave_room`
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
    await socket.leave(roomId);
    const gameRoomSockets = await this.server.in(roomId).fetchSockets();
    const isPlayerLeft = Boolean(
      gameRoomSockets.find((socket) => {
        const { userId } = socket.data as { userId: string };

        return gameRoom.player1.id === userId || gameRoom.player2.id === userId;
      })
    );
    if (!isPlayerLeft) {
      if (!gameRoom.isFinished) {
        // 観戦者を追い出す
        this.server.in(roomId).emit('both_players_disconnected');
        clearInterval(gameRoom.interval);
      }
      this.changePresence(userId, Presence.ONLINE);
      this.server.socketsLeave(roomId);
      this.gameRooms.delete(roomId);
      this.server.to('monitor').emit('room_deleted', roomId);
    }
  }

  @SubscribeMessage('join_monitoring_room')
  async sendAllGameRoomIds(
    @ConnectedSocket() socket: Socket
  ): Promise<string[][]> {
    Logger.debug(
      `${socket.id} ${socket.data.userNickname as string} join_monitoring_room`
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

  @SubscribeMessage('leave_monitoring_room')
  async leaveRoomList(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userNickname as string} leave_monitoring_room`
    );

    await socket.leave('monitor');
  }
}
