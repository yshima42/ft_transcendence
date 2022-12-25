import { Socket, Server } from 'socket.io';
import {
  BALL_SIZE,
  BALL_START_X,
  BALL_START_Y,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_SPEED,
  PADDLE_START_POS,
  PADDLE_WIDTH,
  SCORE_TO_WIN,
} from './config/game-config';
import { CreateMatchResultDto } from './dto/create-match-result.dto';
import { GameService } from './game.service';

export enum GamePhase {
  Joining = 1,
  ConfirmWaiting = 2,
  OpponentWaiting = 4,
  InGame = 5,
  Result = 6,
  PlayerWaiting = 7,
  Watch = 8,
}

class Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;

  constructor(speed: number) {
    this.x = BALL_START_X;
    this.y = BALL_START_Y;
    this.dx = speed;
    this.dy = speed;
  }

  boundX(): void {
    this.dx = -this.dx;
  }

  boundY(): void {
    this.dy = -this.dy;
  }
}

class Paddle {
  x: number;
  y: number;
  dx: number;
  dy: number;

  // xの値はpaddleごとに設定する
  constructor(startX: number) {
    this.x = startX;
    this.y = PADDLE_START_POS;
    this.dx = PADDLE_SPEED;
    this.dy = PADDLE_SPEED;
  }
}

export class Player {
  id: string;
  isLeftSide: boolean;
  isReady: boolean;
  score: number;

  constructor(id: string, isLeftSide: boolean) {
    this.id = id;
    this.isLeftSide = isLeftSide;
    this.isReady = false;
    this.score = 0;
  }
}

// このクラスでゲーム操作を行う
export class GameRoom {
  gameService: GameService;
  id: string;
  server: Server;
  player1: Player;
  player2: Player;
  ball: Ball;
  paddle1: Paddle;
  paddle2: Paddle;
  interval: NodeJS.Timer;
  isInGame: boolean;
  isFinished: boolean;
  countDownNum: number;

  constructor(
    gameService: GameService,
    id: string,
    server: Server,
    player1: Player,
    player2: Player,
    ballSpeed: number
  ) {
    this.gameService = gameService;
    this.id = id;
    this.server = server;
    this.player1 = player1;
    this.player2 = player2;
    this.paddle1 = new Paddle(0);
    this.paddle2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH);
    this.ball = new Ball(ballSpeed);
    this.interval = setInterval(() => {
      // イニシャライズのための空変数
    });
    this.isInGame = false;
    this.isFinished = false;
    this.countDownNum = 10;
    this.countDownUntilPlayerReady();
  }

  countDownUntilPlayerReady(): void {
    const timer = setInterval(() => {
      this.countDownNum--;
      if (this.countDownNum === 0) {
        this.server
          .in([this.id, `watch_${this.id}`])
          .emit('game_room_error', 'No player response.');
        clearInterval(timer);
      } else if (this.isInGame) {
        clearInterval(timer);
      } else {
        this.server
          .in([this.id, `watch_${this.id}`])
          .emit('set_count_down_num', this.countDownNum);
      }
    }, 1000);
  }

  setBallCenter(): void {
    this.ball.x = BALL_START_X;
    this.ball.y = BALL_START_Y;
  }

  gameStart(socket: Socket, roomId: string): void {
    this.interval = setInterval(() => {
      // ゲームロジック
      this.gameLogic(roomId);

      // フレームごとのBall、Paddleポジションの送信
      this.updatePosition(roomId);

      // フレームレート60で計算(1000÷60fps=16.67)、負荷が高い場合は数字をあげる(フレームレート30の場合33をセット)
    }, 17);
  }

  gameLogic(roomId: string): void {
    // フレームごとのボールポジションの移動
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    // x軸のボールの動き(パドルで跳ね返る処理)
    if (this.ball.x + this.ball.dx > CANVAS_WIDTH - BALL_SIZE) {
      if (
        this.ball.y > this.paddle2.y &&
        this.ball.y < this.paddle2.y + PADDLE_HEIGHT
      ) {
        this.ball.boundX();
      } else {
        this.player1.score++;
        this.updateScore(roomId);
        this.setBallCenter();
      }
    } else if (this.ball.x + this.ball.dx < BALL_SIZE) {
      if (
        this.ball.y > this.paddle1.y &&
        this.ball.y < this.paddle1.y + PADDLE_HEIGHT
      ) {
        this.ball.boundX();
      } else {
        this.player2.score++;
        this.updateScore(roomId);
        this.setBallCenter();
      }
    }

    // y軸のボールの動き(壁で跳ね返る処理)
    if (
      this.ball.y + this.ball.dy > CANVAS_HEIGHT - BALL_SIZE ||
      this.ball.y + this.ball.dy < BALL_SIZE
    ) {
      this.ball.boundY();
    }

    // ゲーム終了処理
    if (
      this.player1.score === SCORE_TO_WIN ||
      this.player2.score === SCORE_TO_WIN
    ) {
      void this.doneGame(roomId);
    }
  }

  async doneGame(roomId: string): Promise<void> {
    this.isFinished = true;
    // setIntervalを止める処理
    clearInterval(this.interval);

    // データベースへスコアの保存
    const muchResult: CreateMatchResultDto = {
      playerOneId: this.player1.id,
      playerTwoId: this.player2.id,
      playerOneScore: this.player1.score,
      playerTwoScore: this.player2.score,
    };
    await this.gameService.addMatchResult(muchResult);

    this.server
      .in([roomId, `watch_${roomId}`])
      .emit('update_game_phase', GamePhase.Result);
  }

  // TODO: disconnect処理を実行
  updatePosition(roomId: string): void {
    this.server.in([roomId, `watch_${roomId}`]).emit('update_position', {
      paddle1X: this.paddle1.x,
      paddle1Y: this.paddle1.y,
      paddle2X: this.paddle2.x,
      paddle2Y: this.paddle2.y,
      ballX: this.ball.x,
      ballY: this.ball.y,
    });
  }

  updateScore(roomId: string): void {
    this.server.in([roomId, `watch_${roomId}`]).emit('update_score', {
      player1Score: this.player1.score,
      player2Score: this.player2.score,
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
