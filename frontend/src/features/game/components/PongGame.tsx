import { memo, FC, useCallback, useEffect } from 'react';
import { SOCKET_URL } from 'config/default';
import { io } from 'socket.io-client';
import {
  BALL_START_X,
  BALL_START_Y,
  BG_COLOR,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDLE_START_POS,
  PADDLE_WIDTH,
} from '../utils/gameConfig';
import { Ball, Paddle } from '../utils/objs';
import { userInput } from '../utils/userInput';
import { Canvas } from './Canvas';

const socket = io(SOCKET_URL);

export const PongGame: FC = memo(() => {
  const player1 = new Paddle(0, PADDLE_START_POS);
  const player2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
  const ball = new Ball(BALL_START_X, BALL_START_Y);

  useEffect(() => {
    // TODO: RoomIdを指定する
    socket.emit('connectPong');

    // TODO: Roomがなかった時のエラー処理

    // TODO: Player1か2の決定
    socket.on('connectedPlayer', (data) => {
      console.log(data);
    });
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // ここをpositionUpdateにする
    socket.on('player1Update', (data: { x: number; y: number }) => {
      player1.pos.x = data.x;
      player1.pos.y = data.y;
    });

    socket.on('ballUpdate', (data: { x: number; y: number }) => {
      ball.pos.x = data.x;
      ball.pos.y = data.y;
    });

    player1.draw(ctx);
    player2.draw(ctx);
    ball.draw(ctx);

    userInput(player1);

    // ゲーム終了
    if (player1.score === 3 || player2.score === 3) {
      ctx.fillText('Game Over', 250, 50);
      // TODO: 他の所へ飛ばす等処理をする
    }

    // スコアの表示
    // socket.on('scoreUpdate', (data: { score: number }) => {
    //   player1.score = data.score;
    // });
    ctx.font = '48px serif';
    ctx.fillText(player1.score.toString(), 20, 50);
    ctx.fillText(player2.score.toString(), 960, 50);

    // socket.emit('update', { x: paddle1.pos.x, y: paddle1.pos.y });
  }, []);

  return <Canvas draw={draw} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />;
});
