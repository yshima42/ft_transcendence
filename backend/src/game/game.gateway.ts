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
  BALL_SIZE,
  BALL_START_X,
  BALL_START_Y,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
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
    // socket.emit('room_joined');
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
    // const gameRoom = this.getSocketGameRoom(socket);
    const gameRoom = this.gameRooms[roomId];
    const { ball, paddle1, paddle2 } = gameRoom;

    // console.log(`new client: ${socket.id}`);

    setInterval(() => {
      // パドルで跳ね返る処理
      if (ball.pos.x + ball.dx > CANVAS_WIDTH - BALL_SIZE) {
        if (
          ball.pos.y > paddle2.pos.y &&
          ball.pos.y < paddle2.pos.y + PADDLE_HEIGHT
        ) {
          ball.dx = -ball.dx;
        } else {
          paddle1.score++;
          ball.setPosition(BALL_START_X, BALL_START_Y);
        }
      } else if (ball.pos.x + ball.dx < BALL_SIZE) {
        if (
          ball.pos.y > paddle1.pos.y &&
          ball.pos.y < paddle1.pos.y + PADDLE_HEIGHT
        ) {
          ball.dx = -ball.dx;
        } else {
          paddle2.score++;
          ball.setPosition(BALL_START_X, BALL_START_Y);
        }
      }

      // ゲーム終了
      if (paddle1.score === 5 || paddle2.score === 5) {
        // 結果をデータベースに保存
        // const muchResult: CreateMatchResultDto = {
        //   paddleOneId: 'e8f67e5d-47fb-4a0e-8a3b-aa818eb3ce1a',
        //   paddleTwoId: 'c89ae673-b6fb-415e-9389-5276bbba7a4c',
        //   paddleOneScore: paddle1.score,
        //   paddleTwoScore: paddle2.score,
        // };
        // await gameService.addMatchResult(muchResult);

        socket.to(roomId).emit('done_game', {
          paddle1score: paddle1.score,
          paddle2score: paddle2.score,
        });
        paddle1.score = 0;
        paddle2.score = 0;
      }

      // ボールの動き
      if (
        ball.pos.y + ball.dy > CANVAS_HEIGHT - BALL_SIZE ||
        ball.pos.y + ball.dy < BALL_SIZE
      ) {
        ball.dy = -ball.dy;
      }

      // frameごとに進む
      ball.pos.x += ball.dx * 0.5;
      ball.pos.y += ball.dy * 0.5;

      // frameごとにplayer1,2,ballの位置を送信
      socket.to(roomId).emit('player1_update', {
        x: paddle1.pos.x,
        y: paddle1.pos.y,
        score: paddle1.score,
      });
      socket.to(roomId).emit('player2_update', {
        x: paddle2.pos.x,
        y: paddle2.pos.y,
        score: paddle2.score,
      });
      socket.to(roomId).emit('ball_update', {
        x: ball.pos.x,
        y: ball.pos.y,
      });
    }, 33);

    socket.emit('init_return');
  }

  // @SubscribeMessage('tick')
  // handleNewPlayer(@ConnectedSocket() socket: Socket): void {
  //   // ゲーム終了処理
  //   const doneGame = finishGame(this.player1, this.player2);
  //   doneGame
  //     .then((data) => {
  //       socket.emit('doneGame', {
  //         winner: data,
  //       });
  //       this.player1.score = 0;
  //       this.player2.score = 0;
  //     })
  //     // eslint-disable-next-line @typescript-eslint/no-empty-function
  //     .catch(() => {});
  // }

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
      paddle1.pos.y += PADDLE_SPEED;
      if (paddle1.pos.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
        paddle1.pos.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }
    } else if (command.isLeftSide && command.up) {
      paddle1.pos.y -= PADDLE_SPEED;
      if (paddle1.pos.y < 0) {
        paddle1.pos.y = 0;
      }
    }

    // player2操作
    if (!command.isLeftSide && command.down) {
      paddle2.pos.y += PADDLE_SPEED;
      if (paddle2.pos.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
        paddle2.pos.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }
    } else if (!command.isLeftSide && command.up) {
      paddle2.pos.y -= PADDLE_SPEED;
      if (paddle2.pos.y < 0) {
        paddle2.pos.y = 0;
      }
    }

    // TODO: 最後に消す
    console.log(data);
  }
}
