import { memo, FC, useCallback } from 'react';
// import { SOCKET_URL } from 'config/default';
// import { io } from 'socket.io-client';
import {
  BALL_SIZE,
  BALL_SPEED,
  BALL_START_X,
  BALL_START_Y,
  BG_COLOR,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_START_POS,
  PADDLE_WIDTH,
} from '../utils/gameConfig';
import { Ball, Paddle } from '../utils/objs';
import { userInput } from '../utils/userInput';
import { Canvas } from './Canvas';

// const socket = io(SOCKET_URL);

const scoring = (player: Paddle) => {
  player.score++;
};

// type Players = {
//   [key: string]: { x?: number; y?: number; up?: boolean; down?: boolean };
// };

// type ClientPaddles = {
//   [key: string]: Paddle;
// };

// const clientPaddles: ClientPaddles = {};

export const PongGame: FC = memo(() => {
  // const startX = 40 + Math.random() * 400;
  // const startY = 40 + Math.random() * 300;
  let dX = BALL_SPEED;
  let dY = -BALL_SPEED;
  const player1 = new Paddle(0, PADDLE_START_POS);
  const player2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
  // const paddle2 = new Paddle(startX, startY);
  const ball = new Ball(BALL_START_X, BALL_START_Y);

  // socket.emit('newPlayer', { x: startX, y: startY });
  // socket.on('updatePlayers', (players: Players) => {
  //   for (const id in players) {
  //     console.log(id);
  //     if (clientPaddles[id] === undefined && id !== socket.id) {
  //       clientPaddles[id] = new Paddle(players[id].x, players[id].y);
  //     }
  //   }
  // });

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

    // ゲーム終了
    if (player1.score === 3 || player2.score === 3) {
      ctx.fillText('Game Over', 250, 50);
      // TODO: 他の所へ飛ばす等処理をする
    }

    // スコアの表示
    ctx.font = '48px serif';
    ctx.fillText(player1.score.toString(), 20, 50);
    ctx.fillText(player2.score.toString(), 960, 50);

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
