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
  public userIds: Set<string>;
  private readonly gameRooms: Map<string, GameRoom>;
  private readonly matchWaitingPlayers: Player[] = [];

  constructor(
    private readonly gameService: GameService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {
    this.socketIdToUserId = new Map<string, string>();
    this.userIds = new Set<string>();
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

    socket.emit('connect_established');
    Logger.debug('connected: ' + socket.id);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    const targetUserId = this.socketIdToUserId.get(socket.id);
    if (targetUserId !== undefined) {
      this.socketIdToUserId.delete(socket.id);
      if (this.countConnectionByUserId(targetUserId) === 0) {
        this.userIds.delete(targetUserId);
        socket.broadcast.emit('user_disconnected', targetUserId);
      }
    }

    // debug用
    Logger.debug('disconnected: ' + socket.id);
    console.table(this.socketIdToUserId);
    console.table(this.userIds);
  }

  @SubscribeMessage('handshake')
  handshake(
    @ConnectedSocket() socket: Socket,
    @MessageBody() newUserId: string
  ): string[] {
    const reconnected = this.userIds.has(newUserId);
    if (!reconnected) {
      socket.broadcast.emit('user_connected', newUserId);
    }
    this.socketIdToUserId.set(socket.id, newUserId);
    this.userIds.add(newUserId);

    // debug用
    Logger.debug('handshake: ' + socket.id);
    console.table(this.socketIdToUserId);
    console.table(this.userIds);

    return [...this.userIds];
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
  randomMatch(@ConnectedSocket() socket: Socket): void {
    Logger.debug(
      `${socket.id} ${socket.data.userNickname as string} random_match`
    );

    const { userId, userNickname } = socket.data as {
      userId: string;
      userNickname: string;
    };
    // 1人目の場合2人目ユーザーを待つ
    if (this.matchWaitingPlayers.length === 0) {
      const newPlayer = new Player(socket, userId, userNickname, true);
      this.matchWaitingPlayers.push(newPlayer);
    } else {
      if (this.matchWaitingPlayers[0].id === userId) {
        return;
      }
      const player1 = this.matchWaitingPlayers[0];
      // どちらでもやること同じだけどpop()を採用した
      // this.matchWaitingPlayers.splice(0, 1);
      this.matchWaitingPlayers.pop();

      const player2 = new Player(socket, userId, userNickname, false);
      // 2人揃ったらマッチルーム作る
      const roomId = this.createGameRoom(player1, player2);

      this.server
        .to(player1.socket.id)
        .emit('go_game_room', roomId, player1.isLeftSide);
      this.server
        .to(player2.socket.id)
        .emit('go_game_room', roomId, player2.isLeftSide);
    }
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
  cancelMatching(@ConnectedSocket() socket: Socket): void {
    Logger.debug(
      `${socket.id} ${socket.data.userNickname as string} matching_cancel`
    );

    const { userId } = socket.data as { userId: string };
    const foundIndex = this.matchWaitingPlayers.findIndex(
      (player) => player.id === userId
    );
    if (foundIndex !== undefined) {
      this.matchWaitingPlayers.splice(foundIndex, 1);
    }
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

    const isLeftSide = gameRoom.player1.id === userId;
    if (isLeftSide) {
      gameRoom.player1.socket = socket;
    } else {
      gameRoom.player2.socket = socket;
    }
    await socket.join(message.roomId);
    console.log(`joinRoom: ${socket.id} joined ${message.roomId}`);
    socket.emit('set_side', isLeftSide);
    socket.emit('check_confirmation');
  }

  @SubscribeMessage('confirm')
  confirm(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: { roomId: string; isLeftSide: boolean }
  ): void {
    Logger.debug(`${socket.id} ${socket.data.userNickname as string} confirm`);

    const { roomId, isLeftSide } = message;
    const gameRoom = this.gameRooms.get(roomId);
    if (gameRoom === undefined) {
      socket.emit('invalid_room');

      return;
    }

    const player = isLeftSide ? gameRoom.player1 : gameRoom.player2;
    const opponent = isLeftSide ? gameRoom.player2 : gameRoom.player1;
    player.isReady = true;
    if (!opponent.isReady) {
      socket.emit('wait_opponent');
    } else {
      gameRoom.isInGame = true;
      this.server.in(roomId).emit('start_game');
    }
  }

  @SubscribeMessage('connect_pong')
  connectPong(
    @MessageBody() message: { roomId: string },
    @ConnectedSocket() socket: Socket
  ): void {
    Logger.debug(
      `${socket.id} ${socket.data.userNickname as string} connect_pong`
    );

    // player1のsocketでゲームオブジェクトを作る
    const gameRoom = this.gameRooms.get(message.roomId);
    if (gameRoom !== undefined) {
      if (socket.id === gameRoom.player2.socket.id) {
        return;
      }
      // ゲーム開始
      gameRoom.gameStart(socket, message.roomId);
    }

    // TODO: ゲーム終了後、gameRoomを削除する処理を入れる
  }

  // deleteGameRoom(roomId: string): void {
  //   this.gameRooms[roomId].disconnectAll();
  //   // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  //   delete this.gameRooms[roomId];
  // }

  @SubscribeMessage('user_command')
  handleUserCommands(
    @MessageBody()
    data: {
      roomId: string;
      userCommand: { up: boolean; down: boolean; isLeftSide: boolean };
    }
  ): void {
    const gameRoom = this.gameRooms.get(data.roomId);
    if (gameRoom !== undefined) {
      gameRoom.handleInput(data.roomId, data.userCommand);
    }
  }
}
