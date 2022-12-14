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
import { CreateMatchResultDto } from './dto/create-match-result.dto';
import { GameService } from './game.service';

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

// このクラスでゲーム操作を行う
export class GameRoom {
  gameService: GameService;
  id: string;
  server: Server;
  player1: UserData;
  player2: UserData;
  ball: Ball;
  paddle1: Paddle;
  paddle2: Paddle;
  interval: NodeJS.Timer;

  constructor(
    gameService: GameService,
    id: string,
    server: Server,
    player1: UserData,
    player2: UserData
  ) {
    this.gameService = gameService;
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
    this.interval = setInterval(() => {
      // イニシャライズのための空変数
    });
  }

  setBallCenter(): void {
    this.ball.x = BALL_START_X;
    this.ball.y = BALL_START_Y;
  }

  gameStart(socket: Socket, roomId: string): void {
    this.interval = setInterval(() => {
      this.gameLogic(roomId);
      this.updatePosition(roomId);
      // フレームレート60で計算、負荷が高い場合は数字をあげる
    }, 17);
  }

  gameLogic(roomId: string): void {
    // パドルで跳ね返る処理
    if (this.ball.x + this.ball.dx > CANVAS_WIDTH - BALL_SIZE) {
      if (
        this.ball.y > this.paddle2.y &&
        this.ball.y < this.paddle2.y + PADDLE_HEIGHT
      ) {
        this.ball.dx = -this.ball.dx;
      } else {
        this.paddle1.score++;
        this.updateScore(roomId);
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
        this.updateScore(roomId);
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
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    // ゲーム終了処理
    if (this.paddle1.score === 5 || this.paddle2.score === 5) {
      void this.doneGame(roomId);
    }
  }

  async doneGame(roomId: string): Promise<void> {
    // setIntervalを止める処理
    clearInterval(this.interval);

    // データベースへスコアの保存
    const muchResult: CreateMatchResultDto = {
      playerOneId: this.player1.id,
      playerTwoId: this.player2.id,
      playerOneScore: this.paddle1.score,
      playerTwoScore: this.paddle2.score,
    };
    await this.gameService.addMatchResult(muchResult);

    this.server.in(roomId).emit('done_game');
  }

  // TODO: disconnect処理を実行

  updatePosition(roomId: string): void {
    this.server.in(roomId).emit('position_update', {
      paddle1X: this.paddle1.x,
      paddle1Y: this.paddle1.y,
      paddle2X: this.paddle2.x,
      paddle2Y: this.paddle2.y,
      ballX: this.ball.x,
      ballY: this.ball.y,
    });
  }

  updateScore(roomId: string): void {
    this.server.in(roomId).emit('update_score', {
      paddle1Score: this.paddle1.score,
      paddle2Score: this.paddle2.score,
    });
  }

  handleInput(
    roomId: string,
    userCommands: { up: boolean; down: boolean; isLeftSide: boolean }
  ): void {
    // player1操作
    if (userCommands.isLeftSide && userCommands.down) {
      this.paddle1.y += PADDLE_SPEED;
      if (this.paddle1.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
        this.paddle1.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }
    } else if (userCommands.isLeftSide && userCommands.up) {
      this.paddle1.y -= PADDLE_SPEED;
      if (this.paddle1.y < 0) {
        this.paddle1.y = 0;
      }
    }

    // player2操作
    if (!userCommands.isLeftSide && userCommands.down) {
      this.paddle2.y += PADDLE_SPEED;
      if (this.paddle2.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
        this.paddle2.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }
    } else if (!userCommands.isLeftSide && userCommands.up) {
      this.paddle2.y -= PADDLE_SPEED;
      if (this.paddle2.y < 0) {
        this.paddle2.y = 0;
      }
    }
  }
}
