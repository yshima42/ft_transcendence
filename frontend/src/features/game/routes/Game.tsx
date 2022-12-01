import { memo, FC, useCallback } from 'react';
import { Button, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
// import io from 'socket.io-client';
import { ContentLayout } from 'components/layout/ContentLayout';
import { Canvas } from './Canvas';

// const socket = io.connect('http://localhost:3000');

export const Game: FC = memo(() => {
  let x = 50;
  let y = 100;
  let dx = 5;
  let dy = -5;
  const ballRadius = 10;

  const paddleHeight = 75;
  const paddleWidth = 20;

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
    ctx.fill();

    // 壁で跳ね返る処理
    if (x + dx > ctx.canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy > ctx.canvas.height - ballRadius || y + dy < ballRadius) {
      dy = -dy;
    }

    // frameごとに進む
    x += dx;
    y += dy;
  };

  const drawPaddle = (ctx: CanvasRenderingContext2D) => {
    const paddleY = (ctx.canvas.height - paddleHeight) / 2;

    ctx.beginPath();
    ctx.rect(0, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  };

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawBall(ctx);
    drawPaddle(ctx);
  }, []);

  return (
    <ContentLayout>
      <Center>
        <Canvas draw={draw} />
      </Center>
      <Center>
        <input placeholder="Message..." />
        <Button> send</Button>
        <Link to="/app">
          <Button>Back</Button>
        </Link>
      </Center>
    </ContentLayout>
  );
});
