import {
  BALL_COLOR,
  BALL_SIZE,
  BALL_SPEED,
  PADDLE_COLOR,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from './gameConfig';

export class Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.dx = BALL_SPEED;
    this.dy = -BALL_SPEED;
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
  score: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.score = 0;
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
