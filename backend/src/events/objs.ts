import {
  BALL_COLOR,
  BALL_SIZE,
  BALL_SPEED,
  PADDLE_COLOR,
  PADDLE_HEIGHT,
  PADDLE_SPEED,
  PADDLE_WIDTH,
} from './gameConfig';

export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export class Ball {
  up: boolean;
  down: boolean;
  pos: { x: number; y: number };
  dx: number;
  dy: number;

  constructor(x: number, y: number) {
    this.pos = new Vector(x, y);
    this.up = false;
    this.down = false;
    this.dx = BALL_SPEED;
    this.dy = -BALL_SPEED;
  }

  draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = BALL_COLOR;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, BALL_SIZE, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  };

  setPosition = (x: number, y: number): void => {
    this.pos.x = x;
    this.pos.y = y;
  };
}

export class Paddle {
  id: string;
  role: 'Player1' | 'Player2';
  up: boolean;
  down: boolean;
  pos: { x: number; y: number };
  score: number;

  constructor(x: number, y: number) {
    this.id = '';
    this.role = 'Player1';
    this.pos = new Vector(x, y);
    this.up = false;
    this.down = false;
    this.score = 0;
  }

  draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.beginPath();
    if (this.down) {
      this.pos.y += PADDLE_SPEED;
      if (this.pos.y + PADDLE_HEIGHT > ctx.canvas.height) {
        this.pos.y = ctx.canvas.height - PADDLE_HEIGHT;
      }
    } else if (this.up) {
      this.pos.y -= PADDLE_SPEED;
      if (this.pos.y < 0) {
        this.pos.y = 0;
      }
    }
    ctx.rect(this.pos.x, this.pos.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = PADDLE_COLOR;
    ctx.fill();
    ctx.closePath();
  };

  setPosition = (x: number, y: number): void => {
    this.pos.x = x;
    this.pos.y = y;
  };
}
