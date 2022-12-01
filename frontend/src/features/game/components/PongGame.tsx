import { memo, FC, useCallback } from 'react';
import { Canvas } from './Canvas';

// ToDo: これらを設定などで変えられる機能を作る
const BALL_START_X = 50;
const BALL_START_Y = 100;
const BALL_SPEED = 5;
const BALL_SIZE = 10;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 75;
const PADDLE_START_POS = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
const PADDLE_SPEED = 7;

export const PongGame: FC = memo(() => {
  let ballX = BALL_START_X;
  let ballY = BALL_START_Y;
  let dX = BALL_SPEED;
  let dY = -BALL_SPEED;
  const ballRadius = BALL_SIZE;
  const paddleHeight = PADDLE_HEIGHT;
  const paddleWidth = PADDLE_WIDTH;
  let rightPressed = false;
  let leftPressed = false;

  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);

  function keyDownHandler(e: KeyboardEvent) {
    if (e.key === 'Down' || e.key === 'ArrowDown') {
      rightPressed = true;
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
      leftPressed = true;
    }
  }

  function keyUpHandler(e: KeyboardEvent) {
    if (e.key === 'Down' || e.key === 'ArrowDown') {
      rightPressed = false;
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
      leftPressed = false;
    }
  }

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#4FD1C5';
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
  };

  let paddleY = PADDLE_START_POS;
  const drawPaddle = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();

    if (rightPressed) {
      paddleY += PADDLE_SPEED;
      if (paddleY + paddleHeight > ctx.canvas.height) {
        paddleY = ctx.canvas.height - paddleHeight;
      }
    } else if (leftPressed) {
      paddleY -= PADDLE_SPEED;
      if (paddleY < 0) {
        paddleY = 0;
      }
    }

    ctx.rect(0, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = '#4FD1C5';
    ctx.fill();
    ctx.closePath();
  };

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#1A202C';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawBall(ctx);
    drawPaddle(ctx);

    // パドルで跳ね返る処理・ゲームオーバー処理
    if (ballX + dX > ctx.canvas.width - ballRadius) {
      dX = -dX;
    } else if (ballX + dX < ballRadius) {
      if (ballY > paddleY && ballY < paddleY + paddleHeight) {
        dX = -dX;
      } else {
        console.log('Game Over');
        document.location.reload();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    }

    // 上下の壁で跳ね返る処理
    if (
      ballY + dY > ctx.canvas.height - ballRadius ||
      ballY + dY < ballRadius
    ) {
      dY = -dY;
    }

    // frameごとに進む
    ballX += dX;
    ballY += dY;
  }, []);

  return <Canvas draw={draw} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />;
});
