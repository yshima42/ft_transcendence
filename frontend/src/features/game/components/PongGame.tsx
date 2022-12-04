import { memo, FC, useCallback } from 'react';
import { Canvas } from './Canvas';

// TODO: これらを設定などで変えられる機能を作る
const BALL_START_X = 50;
const BALL_START_Y = 100;
// const BALL_SPEED = 5;
const BALL_SPEED = 5;
const BALL_SIZE = 10;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 75;
const PADDLE_START_POS = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
const PADDLE_SPEED = 7;
const BALL_COLOR = '#4FD1C5';
const PADDLE_COLOR = '#4FD1C5';
const BG_COLOR = '#1A202C';

class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Ball {
  up: boolean;
  down: boolean;
  pos: { x: number; y: number };

  constructor(x: number, y: number) {
    this.pos = new Vector(x, y);
    this.up = false;
    this.down = false;
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = BALL_COLOR;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, BALL_SIZE, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  };
}

class Paddle {
  up: boolean;
  down: boolean;
  pos: { x: number; y: number };

  constructor(x: number, y: number) {
    this.pos = new Vector(x, y);
    this.up = false;
    this.down = false;
  }

  draw = (ctx: CanvasRenderingContext2D) => {
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
}

export const PongGame: FC = memo(() => {
  let dX = BALL_SPEED;
  let dY = -BALL_SPEED;
  const paddle1 = new Paddle(0, PADDLE_START_POS);
  const paddle2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
  const ball = new Ball(BALL_START_X, BALL_START_Y);

  // const { player, setPlayer } = useContext(gameContext);

  // const canvas = document.getElementById('canvas') as HTMLElement;

  const userInput = (obj: Paddle) => {
    document.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === 'Down' || e.key === 'ArrowDown') {
          obj.down = true;
        } else if (e.key === 'Up' || e.key === 'ArrowUp') {
          obj.up = true;
        }
      },
      false
    );

    document.addEventListener(
      'keyup',
      (e: KeyboardEvent) => {
        if (e.key === 'Down' || e.key === 'ArrowDown') {
          obj.down = false;
        } else if (e.key === 'Up' || e.key === 'ArrowUp') {
          obj.up = false;
        }
      },
      false
    );
  };

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    paddle1.draw(ctx);
    paddle2.draw(ctx);
    ball.draw(ctx);

    userInput(paddle1);

    // パドルで跳ね返る処理・ゲームオーバー処理
    if (ball.pos.x + dX > ctx.canvas.width - BALL_SIZE) {
      dX = -dX;
    } else if (ball.pos.x + dX < BALL_SIZE) {
      if (
        ball.pos.y > paddle1.pos.y &&
        ball.pos.y < paddle1.pos.y + PADDLE_HEIGHT
      ) {
        dX = -dX;
      } else {
        console.log('Game Over');
        document.location.reload();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    }

    // // 上下の壁で跳ね返る処理
    if (
      ball.pos.y + dY > ctx.canvas.height - BALL_SIZE ||
      ball.pos.y + dY < BALL_SIZE
    ) {
      dY = -dY;
    }

    // // frameごとに進む
    ball.pos.x += dX;
    ball.pos.y += dY;
  }, []);

  return <Canvas draw={draw} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />;
});
