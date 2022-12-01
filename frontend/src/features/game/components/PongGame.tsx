import { memo, FC, useCallback } from 'react';
import { Canvas } from './Canvas';

const BALL_START_X = 50;
const BALL_START_Y = 100;

export const PongGame: FC = memo(() => {
  let x = BALL_START_X;
  let y = BALL_START_Y;
  let dx = 5;
  let dy = -5;
  const ballRadius = 10;
  const paddleHeight = 75;
  const paddleWidth = 20;

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
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
  };

  let paddleY = 500 / 2;
  const drawPaddle = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();

    if (rightPressed) {
      paddleY += 7;
      if (paddleY + paddleHeight > ctx.canvas.height) {
        paddleY = ctx.canvas.height - paddleHeight;
      }
    } else if (leftPressed) {
      paddleY -= 7;
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

    // 壁で跳ね返る処理
    if (x + dx > ctx.canvas.width - ballRadius) {
      dx = -dx;
    } else if (x + dx < ballRadius) {
      if (y > paddleY && y < paddleY + paddleHeight) {
        dx = -dx;
      } else {
        console.log('Game Over');
        document.location.reload();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    }

    if (y + dy > ctx.canvas.height - ballRadius || y + dy < ballRadius) {
      dy = -dy;
    }

    // frameごとに進む
    x += dx;
    y += dy;
  }, []);

  return <Canvas draw={draw} />;
});
