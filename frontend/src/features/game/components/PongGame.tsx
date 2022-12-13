import { memo, FC, useCallback, useEffect, useContext, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import SocketContext from 'contexts/SocketContext';
import {
  BALL_START_X,
  BALL_START_Y,
  BG_COLOR,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDLE_START_POS,
  PADDLE_WIDTH,
} from '../utils/gameConfig';
import gameContext from '../utils/gameContext';
import { Ball, Paddle } from '../utils/gameObjs';
import { userInput } from '../utils/userInput';
import { Canvas } from './Canvas';
import { Result } from './Result';

export type StartGame = {
  start: boolean;
  isLeftSide: boolean;
};

export const PongGame: FC = memo(() => {
  // TODO: classでnewするよりtypeで型定義するほうが良さそう?(プレーヤーを増やす、ボールを増やす等ゲーム拡張するならnewの方が良い)
  const player1 = new Paddle(0, PADDLE_START_POS);
  const player2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
  const ball = new Ball(BALL_START_X, BALL_START_Y);
  const { socket } = useContext(SocketContext).SocketState;

  const { isLeftSide, isGameStarted, setGameStarted, roomName } =
    useContext(gameContext);
  const [doneGame, setDoneGame] = useState(false);

  // useEffect(() => {
  //   socket?.on('init_return', () => {
  //     setInterval(() => {
  //       // TODO: ここからユーザーインプットを送って反応を良くする
  //       socket.emit('tick', 'hello');
  //     }, 33);
  //   });
  // }, []);

  useEffect(() => {
    // TODO: Roomがなかった時のエラー処理
    socket?.emit('connect_pong', roomName);

    // ゲームスタート処理
    socket?.on('start_game', () => {
      setGameStarted(true);
    });

    // ゲーム終了処理
    socket?.on('done_game', () => {
      setDoneGame(true);
    });

    // ゲームで表示するオブジェクトのポジション受け取り
    socket?.on(
      'player1_update',
      (data: { x: number; y: number; score: number }) => {
        player1.pos.x = data.x;
        player1.pos.y = data.y;
        player1.score = data.score;
      }
    );

    socket?.on(
      'player2_update',
      (data: { x: number; y: number; score: number }) => {
        player2.pos.x = data.x;
        player2.pos.y = data.y;
        player2.score = data.score;
      }
    );

    socket?.on('ball_update', (data: { x: number; y: number }) => {
      ball.pos.x = data.x;
      ball.pos.y = data.y;
    });
  }, []);

  // このdrawの中にcanvasで表示したいものを書く
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    player1.draw(ctx);
    player2.draw(ctx);
    ball.draw(ctx);

    // TODO: player1だけになってるの修正
    userInput(socket, roomName, player1, isLeftSide);

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
