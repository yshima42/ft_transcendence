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

@WebSocketGateway({ cors: { origin: '*' } })
export class UsersGateway {
  public socketIdToUserId: Map<string, string>;
  // public userIds: Set<string>;
  public userIdToStatus: Map<string, 'ONLINE' | 'INGAME'>;
  private readonly gameRooms: Map<string, GameRoom>;

  constructor(
    private readonly gameService: GameService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {
    this.socketIdToUserId = new Map<string, string>();
    // this.userIds = new Set<string>();
    this.userIdToStatus = new Map<string, 'ONLINE' | 'INGAME'>();
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
      // this.userIds.delete(userId);
      this.userIdToStatus.delete(userId);
      socket.broadcast.emit('user_disconnected', [
        userId,
        this.userIdToStatus.get(userId),
      ]);
    }

    // disconnect されたら、room からも自動で消えるため、一旦コメントアウト
    // await socket.leave(userId);
    // await socket.leave('matching');
    await this.leaveGameRoom(socket);

    // debug用
    Logger.debug('disconnected: ' + socket.id);
    console.table(this.socketIdToUserId);
    // console.table(this.userIds);
  }

  @SubscribeMessage('handshake')
  handshake(
    @ConnectedSocket() socket: Socket
  ): Array<[string, 'ONLINE' | 'INGAME']> {
    const { userId } = socket.data as { userId: string };
    // const reconnected = this.userIds.has(userId);
    const reconnected = this.userIdToStatus.has(userId);
    if (!reconnected) {
      socket.broadcast.emit('user_connected', [
        userId,
        this.userIdToStatus.get(userId),
      ]);
    }
    this.socketIdToUserId.set(socket.id, userId);
    // this.userIds.add(userId);
    this.userIdToStatus.set(userId, 'ONLINE');

    // debug用
    Logger.debug('handshake: ' + socket.id);
    console.table(this.socketIdToUserId);
    // console.table(this.userIds);

    // return [...this.userIds];
    return [...this.userIdToStatus];
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

    // 1人目の場合2人目ユーザーを待つ
    const { userId, userNickname } = socket.data as {
      userId: string;
      userNickname: string;
    };
    const matchingSockets = await this.server.in('matching').fetchSockets();
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

    // if (gameRoom.player1.id !== userId && gameRoom.player2.id !== userId) {
    //   socket.emit('watch_game');

    //   return;
    // }

    const [player, opponent] =
      gameRoom.player1.id === userId
        ? [gameRoom.player1, gameRoom.player2]
        : [gameRoom.player2, gameRoom.player1];
    socket.emit('set_side', player.isLeftSide);
    await socket.join(message.roomId);
    if (!player.isReady) {
      socket.emit('check_confirmation');
    } else if (!opponent.isReady) {
      socket.emit('wait_opponent');
    } else if (!gameRoom.isFinished) {
      socket.emit('start_game');
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

    const [player, opponent] =
      gameRoom.player1.id === userId
        ? [gameRoom.player1, gameRoom.player2]
        : [gameRoom.player2, gameRoom.player1];
    player.isReady = true;
    if (!opponent.isReady) {
      this.server.to(player.id).emit('wait_opponent');
    } else {
      this.server.in(roomId).emit('start_game');
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
      // ゲーム開始
      gameRoom.gameStart(socket, roomId);
    }

    // TODO: ゲーム終了後、gameRoomを削除する処理を入れる
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
    const { roomId } = socket.data as { roomId: string | undefined };
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
    if (gameRoomSockets.length === 0) {
      // 観戦用
      // if (!gameRoom.isFinished) {
      //   this.server.in(roomId).emit('both_players_disconnected');
      // }
      this.gameRooms.delete(roomId);
    }
  }
}
