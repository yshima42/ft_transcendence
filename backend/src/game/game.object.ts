import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
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
  READY_COUNTDOWN_NUM,
  SCORE_TO_WIN,
} from './config/game-config';
import { CreateMatchResultDto } from './dto/create-match-result.dto';
import { GameService } from './game.service';

export enum GamePhase {
  SocketConnecting = 0,
  Joining = 1,
  ConfirmWaiting = 2,
  Confirming = 3,
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
  isBallStop: boolean;
  readyCountDownNum: number;
  deleteGameRoom: (gameRoom: GameRoom) => void;

  constructor(
    gameService: GameService,
    server: Server,
    deleteGameRoom: (gameRoom: GameRoom) => void,
    player1: Player,
    player2: Player,
    ballSpeed?: number
  ) {
    this.gameService = gameService;
    this.server = server;
    this.deleteGameRoom = deleteGameRoom;
    this.id = uuidv4();
    this.player1 = player1;
    this.player2 = player2;
    this.paddle1 = new Paddle(0);
    this.paddle2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH);
    this.ball = new Ball(ballSpeed ?? BALL_SPEED);
    this.interval = setInterval(() => {
      // イニシャライズのための空変数
    });
    this.isInGame = false;
    this.isFinished = false;
    this.isBallStop = true;
    this.readyCountDownNum = 0;
    this.countDownUntilPlayerReady();
  }

  countDownUntilPlayerReady(): void {
    this.readyCountDownNum = READY_COUNTDOWN_NUM;
    this.server
      .in([this.id, `watch_${this.id}`])
      .emit('update_ready_count_down_num', this.readyCountDownNum);
    const timer = setInterval(() => {
      this.readyCountDownNum--;
      if (this.isInGame) {
        clearInterval(timer);
      } else if (this.readyCountDownNum === 0) {
        this.server
          .in([this.id, `watch_${this.id}`])
          .emit('game_room_error', 'The game was canceled.');
        clearInterval(timer);
      } else {
        this.server
          .in([this.id, `watch_${this.id}`])
          .emit('update_ready_count_down_num', this.readyCountDownNum);
      }
    }, 1000);
  }

  countDownUntilGameRestart(): void {
    this.isBallStop = true;
    setTimeout(() => {
      this.isBallStop = false;
    }, 1000);
  }

  setBallCenter(): void {
    this.ball.x = BALL_START_X;
    this.ball.y = BALL_START_Y;
  }

  gameStart(roomId: string): void {
    this.countDownUntilGameRestart();

    this.interval = setInterval(() => {
      this.gameLogic(roomId);
      this.sendPosition(roomId);

      // フレームレート60で計算(1000÷60fps=16.67)、負荷が高い場合は数字をあげる
      // (フレームレート30の場合33をセット)
    }, 17);
  }

  // 1フレームごとのロジック処理
  gameLogic(roomId: string): void {
    if (!this.isBallStop) {
      this.ball.x += this.ball.dx;
      this.ball.y += this.ball.dy;
    }

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
        if (this.player1.score === SCORE_TO_WIN) {
          void this.doneGame(roomId);
        } else {
          this.setBallCenter();
          this.countDownUntilGameRestart();
        }
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
        if (this.player2.score === SCORE_TO_WIN) {
          void this.doneGame(roomId);
        } else {
          this.setBallCenter();
          this.countDownUntilGameRestart();
        }
      }
    }

    // y軸のボールの動き(壁で跳ね返る処理)
    if (
      this.ball.y + this.ball.dy > CANVAS_HEIGHT - BALL_SIZE ||
      this.ball.y + this.ball.dy < BALL_SIZE
    ) {
      this.ball.boundY();
    }
  }

  async doneGame(roomId: string): Promise<void> {
    this.isFinished = true;
    clearInterval(this.interval);
    this.deleteGameRoom(this);

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

  // 1フレームごとにクライアントに送信。
  sendPosition(roomId: string): void {
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

  // ユーザーの操作を受け取って位置を更新。送信はしない。
  handleInput(userCommands: {
    up: boolean;
    down: boolean;
    isLeftSide: boolean;
  }): void {
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
