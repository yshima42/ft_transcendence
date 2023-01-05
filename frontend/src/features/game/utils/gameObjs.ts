import {
  OBJS_COLOR,
  BALL_SIZE,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  CANVAS_WIDTH,
} from './gameConfig';

export class Ball {
  x: number;
  y: number;
  size: number;

  // 位置はサーバーから取ってくるため初期値必要なし
  constructor() {
    this.x = 0;
    this.y = 0;
    this.size = BALL_SIZE;
  }

  draw = (ctx: CanvasRenderingContext2D, ratio: number): void => {
    ctx.fillStyle = OBJS_COLOR;
    ctx.beginPath();
    ctx.arc(this.x * ratio, this.y * ratio, this.size * ratio, 0, 2 * Math.PI);
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
  width: number;
  height: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
  }

  draw = (ctx: CanvasRenderingContext2D, ratio: number): void => {
    ctx.beginPath();
    ctx.rect(
      this.x * ratio,
      this.y * ratio,
      this.width * ratio,
      this.height * ratio
    );
    ctx.fillStyle = OBJS_COLOR;
    ctx.fill();
    ctx.closePath();
  };

  setPosition = (x: number, y: number): void => {
    this.x = x;
    this.y = y;
  };
}

export class Player {
  id: string;
  score: number;

  constructor() {
    this.id = '';
    this.score = 0;
  }

  drawScore = (
    ctx: CanvasRenderingContext2D,
    ratio: number,
    isLeftSide: boolean
  ): void => {
    const fontSize = 48 * ratio;
    ctx.font = `${fontSize}px serif`;
    const [x, y] = isLeftSide
      ? [20 * ratio, 50 * ratio]
      : [(CANVAS_WIDTH - 40) * ratio, 50 * ratio];

    ctx.fillText(this.score.toString(), x, y);
  };
}
