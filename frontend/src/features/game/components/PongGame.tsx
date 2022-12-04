import { memo, FC, useCallback } from 'react';
// import { SOCKET_URL } from 'config/default';
// import { io } from 'socket.io-client';
import { Canvas } from './Canvas';

// TODO: これらを設定などで変えられる機能を作る
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;
const BALL_START_X = CANVAS_WIDTH / 2;
const BALL_START_Y = CANVAS_HEIGHT / 2;
const BALL_SPEED = 5;
const BALL_SIZE = 10;
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

  setPosition = (x: number, y: number) => {
    this.pos.x = x;
    this.pos.y = y;
  };
}

class Paddle {
  up: boolean;
  down: boolean;
  pos: { x: number; y: number };
  score: number;

  constructor(x: number, y: number) {
    this.pos = new Vector(x, y);
    this.up = false;
    this.down = false;
    this.score = 0;
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

  setPosition = (x: number, y: number) => {
    this.pos.x = x;
    this.pos.y = y;
  };
}

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

// const socket = io(SOCKET_URL);

const scoring = (player: Paddle) => {
  player.score++;
};

export const PongGame: FC = memo(() => {
  // const startX = 40 + Math.random() * 400;
  // const startY = 40 + Math.random() * 300;
  let dX = BALL_SPEED;
  let dY = -BALL_SPEED;
  const player1 = new Paddle(0, PADDLE_START_POS);
  const player2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
  // const paddle2 = new Paddle(startX, startY);
  const ball = new Ball(BALL_START_X, BALL_START_Y);

  // const { player, setPlayer } = useContext(gameContext);

  // const canvas = document.getElementById('canvas') as HTMLElement;

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    player1.draw(ctx);
    player2.draw(ctx);
    ball.draw(ctx);

    userInput(player1);

    // パドルで跳ね返る処理・ゲームオーバー処理
    // TODO: 壁で跳ね返る処理はcanvasのwallを使えるかも
    if (ball.pos.x + dX > ctx.canvas.width - BALL_SIZE) {
      if (
        ball.pos.y > player2.pos.y &&
        ball.pos.y < player2.pos.y + PADDLE_HEIGHT
      ) {
        dX = -dX;
      } else {
        scoring(player1);
        ball.setPosition(BALL_START_X, BALL_START_Y);
      }
    } else if (ball.pos.x + dX < BALL_SIZE) {
      if (
        ball.pos.y > player1.pos.y &&
        ball.pos.y < player1.pos.y + PADDLE_HEIGHT
      ) {
        dX = -dX;
      } else {
        scoring(player2);
        ball.setPosition(BALL_START_X, BALL_START_Y);
      }
    }

    // スコアの表示
    ctx.font = '48px serif';
    ctx.fillText(player1.score.toString(), 20, 50);
    ctx.fillText(player2.score.toString(), 800, 50);

    // 上下の壁で跳ね返る処理
    if (
      ball.pos.y + dY > ctx.canvas.height - BALL_SIZE ||
      ball.pos.y + dY < BALL_SIZE
    ) {
      dY = -dY;
    }

    // frameごとに進む
    ball.pos.x += dX;
    ball.pos.y += dY;

    // socket.emit('update', { x: paddle1.pos.x, y: paddle1.pos.y });
  }, []);

  return <Canvas draw={draw} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />;
});
