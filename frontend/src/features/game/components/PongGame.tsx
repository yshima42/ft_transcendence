import { memo, FC, useCallback, useEffect, useContext, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
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
import gameService from '../utils/gameService';
import socketService from '../utils/socketService';
import { Canvas } from './Canvas';
import { Result } from './Result';

export type StartGame = {
  start: boolean;
  isLeftSide: boolean;
};

// emitの回数を減らすため
let justPressed = false;
export const userInput = (obj: Paddle, isLeftSide: boolean): void => {
  const socket = socketService.socket;
  if (socket == null) return;
  document.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (e.key === 'Down' || e.key === 'ArrowDown') {
        if (!obj.down) {
          justPressed = true;
        }
        obj.down = true;
      } else if (e.key === 'Up' || e.key === 'ArrowUp') {
        if (!obj.up) {
          justPressed = true;
        }
        obj.up = true;
      }
      if (justPressed) {
        if (socket != null) {
          void gameService.emitUserCommands(socket, obj, isLeftSide);
          justPressed = false;
        }
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
      if (justPressed) {
        if (socket != null) {
          void gameService.emitUserCommands(socket, obj, isLeftSide);
        }
      }
    },
    false
  );
};

export const PongGame: FC = memo(() => {
  // TODO: classでnewするよりtypeで型定義するほうが良さそう?(プレーヤーを増やす、ボールを増やす等ゲーム拡張するならnewの方が良い)
  const player1 = new Paddle(0, PADDLE_START_POS);
  const player2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
  const ball = new Ball(BALL_START_X, BALL_START_Y);

  const { isGameStarted, setGameStarted } = useContext(gameContext);
  const [doneGame, setDoneGame] = useState(false);
  const socket = socketService.socket;

  // TODO: これをuseStateにしたら動かなくなる理由検証・修正
  let isLeftSide: boolean;
  const handleGameStart = () => {
    if (socket != null) {
      gameService.onStartGame(socket, (options: StartGame) => {
        // 2プレーヤーが揃うとゲームスタート
        setGameStarted(true);

        // プレーヤーのサイド決定
        isLeftSide = options.isLeftSide;
      });
    }
  };

  useEffect(() => {
    handleGameStart();
  }, []);

  useEffect(() => {
    socket?.on('initReturn', () => {
      setInterval(() => {
        // TODO: ここからユーザーインプットを送って反応を良くする
        socket.emit('tick', 'hello');
      }, 33);
    });
  }, []);

  useEffect(() => {
    // TODO: RoomIdを指定する
    if (socket != null) socket.emit('connectPong');

    // TODO: Roomがなかった時のエラー処理

    // TODO: Player1か2の決定
    if (socket != null)
      socket.on('connectedPlayer', (data) => {
        console.log(data);
      });

    if (socket != null)
      socket.on('doneGame', () => {
        setDoneGame(true);
      });
  }, []);

  // このdrawの中にcanvasで表示したいものを書く
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // ここをpositionUpdateにする
    if (socket != null)
      socket.on(
        'player1Update',
        (data: { x: number; y: number; score: number }) => {
          player1.pos.x = data.x;
          player1.pos.y = data.y;
          player1.score = data.score;
        }
      );

    if (socket != null)
      socket.on(
        'player2Update',
        (data: { x: number; y: number; score: number }) => {
          player2.pos.x = data.x;
          player2.pos.y = data.y;
          player2.score = data.score;
        }
      );

    if (socket != null)
      socket.on('ballUpdate', (data: { x: number; y: number }) => {
        ball.pos.x = data.x;
        ball.pos.y = data.y;
      });

    player1.draw(ctx);
    player2.draw(ctx);
    ball.draw(ctx);

    // TODO: player1だけになってるの修正
    userInput(player1, isLeftSide);

    // スコアの表示
    ctx.font = '48px serif';
    ctx.fillText(player1.score.toString(), 20, 50);
    ctx.fillText(player2.score.toString(), 960, 50);

    // socket.emit('update', { x: paddle1.pos.x, y: paddle1.pos.y });
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
