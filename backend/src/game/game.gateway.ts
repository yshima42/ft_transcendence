import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line import/extensions
import { UserData, GameRoom, GameRoomDict } from './game.object';
import { GameService } from './game.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/game' })
export class GameGateway {
  // gameServiceを使うのに必要
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  private readonly server!: Server;

  // このクラスで使う配列・変数
  private readonly gameRooms: GameRoomDict = {};
  private readonly matchWaitingUsers: UserData[] = [];

  // 本来はhandleConnectionでやりたいが、authGuardで対応できないため、こちらでUser情報セット
  @SubscribeMessage('set_user')
  setUserToSocket(
    @MessageBody() user: User,
    @ConnectedSocket() socket: Socket
  ): void {
    // socket.dataに情報を登録
    socket.data.userId = user.id;
    socket.data.userNickname = user.nickname;
  }

  @SubscribeMessage('random_match')
  randomMatch(@ConnectedSocket() socket: Socket): void {
    const userData: UserData = {
      socket,
      id: socket.data.userId as string,
      nickname: socket.data.userNickname as string,
      inGame: true,
    };
    // 1人目の場合2人目ユーザーを待つ
    if (this.matchWaitingUsers.length === 0) {
      userData.isLeftSide = true;
      this.matchWaitingUsers.push(userData);
    } else {
      // 2人揃ったらマッチルーム作る
      userData.isLeftSide = false;
      const roomId = this.createGameRoom(this.matchWaitingUsers[0], userData);

      this.server
        .to(socket.id)
        .emit('go_game_room', roomId, userData.isLeftSide);
      this.server
        .to(this.matchWaitingUsers[0].socket.id)
        .emit('go_game_room', roomId, this.matchWaitingUsers[0].isLeftSide);

      this.matchWaitingUsers.splice(0, 1);

      const gameRoom = this.gameRooms[roomId];
      // ゲーム開始
      gameRoom.gameStart(socket, roomId);

      // TODO: ゲーム終了後、gameRoomを削除する処理を入れる
    }
  }

  createGameRoom(player1: UserData, player2: UserData): string {
    const id = uuidv4();
    const gameRoom = new GameRoom(
      this.gameService,
      id,
      this.server,
      player1,
      player2
    );
    this.gameRooms[id] = gameRoom;

    return id;
  }

  // room関連;
  @SubscribeMessage('join_room')
  async joinRoom(
    @MessageBody() message: { roomId: string },
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    await socket.join(message.roomId);
    console.log(`joinRoom: ${socket.id} joined ${message.roomId}`);

    socket.emit('start_game');
  }

  @SubscribeMessage('user_commands')
  handleUserCommands(
    @MessageBody()
    data: {
      roomId: string;
      userCommands: { up: boolean; down: boolean; isLeftSide: boolean };
    }
  ): void {
    const gameRoom = this.gameRooms[data.roomId];

    gameRoom.handleInput(data.roomId, data.userCommands);
  }
}
