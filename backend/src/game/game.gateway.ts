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
import {
  CANVAS_HEIGHT,
  PADDLE_HEIGHT,
  PADDLE_SPEED,
} from './config/game-config';
// TODO: 名前変更
// eslint-disable-next-line import/extensions
import { GameRoom, GameRoomDict } from './game.class';
import { UserData } from './game.interface';
import { GameService } from './game.service';

// const finishGame = async (player1: Paddle, player2: Paddle) => {
//   return await new Promise((resolve) => {
//     if (player1.score === 5) {
//       resolve('player1');
//     } else if (player2.score === 5) {
//       resolve('player2');
//     }
//   });
// };

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

      // isLeftSide, true or falseで良い
      this.server
        .to(socket.id)
        .emit('go_game_room', roomId, userData.isLeftSide);
      this.server
        .to(this.matchWaitingUsers[0].socket.id)
        .emit('go_game_room', roomId, this.matchWaitingUsers[0].isLeftSide);

      this.matchWaitingUsers.splice(0, 1);
    }
  }

  createGameRoom(player1: UserData, player2: UserData): string {
    const id = uuidv4();
    const gameRoom = new GameRoom(id, this.server, player1, player2);
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

    // TODO: 一つにできないか
    socket.emit('start_game');
    socket.to(message.roomId).emit('start_game');
  }

  @SubscribeMessage('connect_pong')
  handleConnectPong(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomId: string
  ): void {
    const gameRoom = this.gameRooms[roomId];

    // ゲーム開始
    gameRoom.start(socket, roomId);
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
    const { paddle1, paddle2 } = gameRoom;
    const command = data.userCommands;

    // player1操作
    if (command.isLeftSide && command.down) {
      paddle1.y += PADDLE_SPEED;
      if (paddle1.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
        paddle1.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }
    } else if (command.isLeftSide && command.up) {
      paddle1.y -= PADDLE_SPEED;
      if (paddle1.y < 0) {
        paddle1.y = 0;
      }
    }

    // player2操作
    if (!command.isLeftSide && command.down) {
      paddle2.y += PADDLE_SPEED;
      if (paddle2.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
        paddle2.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }
    } else if (!command.isLeftSide && command.up) {
      paddle2.y -= PADDLE_SPEED;
      if (paddle2.y < 0) {
        paddle2.y = 0;
      }
    }

    // TODO: 最後に消す
    console.log(data);
  }
}
