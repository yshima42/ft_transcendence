import { memo, FC, useCallback, useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { useGame } from '../hooks/useGame';
import {
  BALL_START_X,
  BALL_START_Y,
  BG_COLOR,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDLE_START_POS,
  PADDLE_WIDTH,
} from '../utils/gameConfig';
import { Ball, Paddle } from '../utils/gameObjs';
import socketService from '../utils/socketService';
import { userInput } from '../utils/userInput';
import { Canvas } from './Canvas';
import { Result } from './Result';

export type StartGame = {
  start: boolean;
  isLeftSide: boolean;
};

export const PongGame: FC = memo(() => {
  const player1 = new Paddle(0, PADDLE_START_POS);
  const player2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
  const ball = new Ball(BALL_START_X, BALL_START_Y);

  // const { isLeftSide, isGameStarted, setGameStarted, roomName } =
  //   props.gameContextValue;
  const { room, isGameStarted, setIsGameStarted } = useGame().gameState;
  const { roomId: roomName, isLeftSide } = room;
  const [doneGame, setDoneGame] = useState(false);

  useEffect(() => {
    const socket = socketService.socket;
    if (socket === null) return;

    // ゲームスタート処理
    socket.on('start_game', () => {
      setIsGameStarted(true);

      socket.emit('connect_pong', { roomId: roomName });
    });

    // ゲーム終了処理
    socket.on('done_game', () => {
      setDoneGame(true);
    });

    // プレーヤー操作
    // TODO: player1だけになってるのを修正
    userInput(socket, roomName, player1, isLeftSide);

    // スコア受け取り
    socket.on(
      'update_score',
      (data: { paddle1Score: number; paddle2Score: number }) => {
        player1.score = data.paddle1Score;
        player2.score = data.paddle2Score;
      }
    );

    // ゲームで表示するオブジェクトのポジション受け取り
    socket.on(
      'position_update',
      (data: {
        paddle1X: number;
        paddle1Y: number;
        paddle2X: number;
        paddle2Y: number;
        ballX: number;
        ballY: number;
      }) => {
        player1.pos.x = data.paddle1X;
        player1.pos.y = data.paddle1Y;
        player2.pos.x = data.paddle2X;
        player2.pos.y = data.paddle2Y;
        ball.pos.x = data.ballX;
        ball.pos.y = data.ballY;
      }
    );

    return () => {
      socket?.off('start_game');
      socket?.off('done_game');
      socket?.off('update_score');
      socket?.off('position_update');
    };
  }, []);

  // draw関数の中にcanvasで表示したいものを書く
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // canvas背景の設定
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // ゲームオブジェクトの表示
    player1.draw(ctx);
    player2.draw(ctx);
    ball.draw(ctx);

    // スコアの表示
    ctx.font = '48px serif';
    ctx.fillText(player1.score.toString(), 20, 50);
    ctx.fillText(player2.score.toString(), 960, 50);
  }, []);

  return (
    <>
      {!isGameStarted && <Spinner />}
      {!doneGame && isGameStarted && (
        <Canvas draw={draw} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
      )}
      {doneGame && <Result />}
    </>
  );
});
