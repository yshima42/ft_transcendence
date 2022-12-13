import { Socket, Server } from 'socket.io';
import {
  BALL_SIZE,
  BALL_SPEED,
  BALL_START_X,
  BALL_START_Y,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_SPEED,
  PADDLE_START_POS,
  PADDLE_WIDTH,
} from './config/game-config';

export type Ball = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

const defaultBall = {
  x: BALL_START_X,
  y: BALL_START_Y,
  dx: BALL_SPEED,
  dy: BALL_SPEED,
};

export type Paddle = {
  up: boolean;
  down: boolean;
  x: number;
  y: number;
  score: number;
  dx: number;
  dy: number;
};

// xの値はpaddleごとに設定する
const defaultPaddle = {
  up: false,
  down: false,
  y: PADDLE_START_POS,
  score: 0,
  dx: PADDLE_SPEED,
  dy: PADDLE_SPEED,
};

export type GameRoomDict = {
  [id: string]: GameRoom;
};

export type UserData = {
  isLeftSide?: boolean;
  socket: Socket;
  id: string;
  nickname: string;
  inGame: boolean;
};

export type UserDict = {
  [id: string]: UserData;
};

// このクラスに全て集約
export class GameRoom {
  id: string;
  server: Server;
  player1: UserData;
  player2: UserData;
  ball: Ball;
  paddle1: Paddle;
  paddle2: Paddle;

  constructor(
    id: string,
    server: Server,
    player1: UserData,
    player2: UserData
  ) {
    this.id = id;
    this.server = server;
    this.player1 = player1;
    this.player2 = player2;
    this.paddle1 = { ...defaultPaddle, x: 0 };
    this.paddle2 = {
      ...defaultPaddle,
      x: CANVAS_WIDTH - PADDLE_WIDTH,
    };
    this.ball = { ...defaultBall };
  }

  setBallCenter(): void {
    this.ball.x = BALL_START_X;
    this.ball.y = BALL_START_Y;
  }

  start(socket: Socket, roomId: string): void {
    setInterval(() => {
      // パドルで跳ね返る処理
      if (this.ball.x + this.ball.dx > CANVAS_WIDTH - BALL_SIZE) {
        if (
          this.ball.y > this.paddle2.y &&
          this.ball.y < this.paddle2.y + PADDLE_HEIGHT
        ) {
          this.ball.dx = -this.ball.dx;
        } else {
          this.paddle1.score++;
          this.setBallCenter();
        }
      } else if (this.ball.x + this.ball.dx < BALL_SIZE) {
        if (
          this.ball.y > this.paddle1.y &&
          this.ball.y < this.paddle1.y + PADDLE_HEIGHT
        ) {
          this.ball.dx = -this.ball.dx;
        } else {
          this.paddle2.score++;
          this.setBallCenter();
        }
      }

      // ボールの動き
      if (
        this.ball.y + this.ball.dy > CANVAS_HEIGHT - BALL_SIZE ||
        this.ball.y + this.ball.dy < BALL_SIZE
      ) {
        this.ball.dy = -this.ball.dy;
      }

      // frameごとに進む
      this.ball.x += this.ball.dx * 0.5;
      this.ball.y += this.ball.dy * 0.5;

      // frameごとにplayer1,2,ballの位置を送信
      // TODO: 全て一緒にする
      socket.to(roomId).emit('position_update', {
        paddle1X: this.paddle1.x,
        paddle1Y: this.paddle1.y,
        paddle2X: this.paddle2.x,
        paddle2Y: this.paddle2.y,
        paddle1Score: this.paddle1.score,
        paddle2Score: this.paddle2.score,
        ballX: this.ball.x,
        ballY: this.ball.y,
      });

      // ゲーム終了処理
      if (this.paddle1.score === 5 || this.paddle2.score === 5) {
        // 結果をデータベースに保存
        // const muchResult: CreateMatchResultDto = {
        //   paddleOneId: 'e8f67e5d-47fb-4a0e-8a3b-aa818eb3ce1a',
        //   paddleTwoId: 'c89ae673-b6fb-415e-9389-5276bbba7a4c',
        //   paddleOneScore: paddle1.score,
        //   paddleTwoScore: paddle2.score,
        // };
        // await gameService.addMatchResult(muchResult);

        socket.emit('done_game');
        socket.to(roomId).emit('done_game', {
          paddle1score: this.paddle1.score,
          paddle2score: this.paddle2.score,
        });
        this.paddle1.score = 0;
        this.paddle2.score = 0;
      }
    }, 33);
  }
}
