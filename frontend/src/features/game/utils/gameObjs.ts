import {
  BALL_COLOR,
  BALL_SIZE,
  PADDLE_COLOR,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from './gameConfig';

export class Ball {
  x: number;
  y: number;

  // 位置はサーバーから取ってくるため初期値必要なし
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = BALL_COLOR;
    ctx.beginPath();
    ctx.arc(this.x, this.y, BALL_SIZE, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  };

  setPosition = (x: number, y: number): void => {
    this.x = x;
    this.y = y;
  };
}

export class Paddle {
  x: number;
  y: number;

  constructor() {
    this.x = 0;
    this.y = 0;
  }

  draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.beginPath();
    ctx.rect(this.x, this.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = PADDLE_COLOR;
    ctx.fill();
    ctx.closePath();
  };

  setPosition = (x: number, y: number): void => {
    this.x = x;
    this.y = y;
  };
}
