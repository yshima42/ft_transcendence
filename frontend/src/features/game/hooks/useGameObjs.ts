import { useCallback, useLayoutEffect, useMemo } from 'react';
import { Socket } from 'socket.io-client';
import {
  BALL_SIZE,
  BG_COLOR,
  CANVAS_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from '../utils/gameConfig';
import { Ball, Paddle, Player } from '../utils/gameObjs';

export const useGameObjs = (
  socket: Socket
): {
  player1: Player;
  player2: Player;
  paddle1: Paddle;
  paddle2: Paddle;
  ball: Ball;
  userCommand: { up: boolean; down: boolean; isLeftSide: boolean };
  canvasSize: { width: number; height: number; ratio: number };
  keyDownEvent: (e: KeyboardEvent) => void;
  keyUpEvent: (e: KeyboardEvent) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
} => {
  const player1: Player = useMemo(() => new Player(), []);
  const player2: Player = useMemo(() => new Player(), []);
  const paddle1 = useMemo(() => new Paddle(), []);
  const paddle2 = useMemo(() => new Paddle(), []);
  const ball = useMemo(() => new Ball(), []);
  const userCommand = useMemo(
    () => ({ up: false, down: false, isLeftSide: true }),
    []
  );
  const canvasSize = useMemo(() => ({ width: 0, height: 0, ratio: 0 }), []);

  const keyDownEvent = useCallback((e: KeyboardEvent) => {
    // 押したままでも発火するため、1回のみ発火。
    if (userCommand.down || userCommand.up) {
      return;
    }
    if (e.key === 'Down' || e.key === 'ArrowDown') {
      userCommand.down = true;
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
      userCommand.up = true;
    }
    socket.emit('user_command', { userCommand });
  }, []);

  const keyUpEvent = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Down' || e.key === 'ArrowDown') {
      userCommand.down = false;
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
      userCommand.up = false;
    }
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // canvas背景の設定
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // ゲームオブジェクトのサイズの設定
    paddle1.height = PADDLE_HEIGHT * canvasSize.ratio;
    paddle1.width = PADDLE_WIDTH * canvasSize.ratio;
    paddle2.height = PADDLE_HEIGHT * canvasSize.ratio;
    paddle2.width = PADDLE_WIDTH * canvasSize.ratio;
    ball.size = BALL_SIZE * canvasSize.ratio;

    // ゲームオブジェクトの表示
    paddle1.draw(ctx);
    paddle2.draw(ctx);
    ball.draw(ctx);

    // スコアの表示
    const fontSize = 48 * canvasSize.ratio;
    ctx.font = `${fontSize}px serif`;
    ctx.fillText(
      player1.score.toString(),
      20 * canvasSize.ratio,
      50 * canvasSize.ratio
    );
    ctx.fillText(
      player2.score.toString(),
      (CANVAS_WIDTH - 40) * canvasSize.ratio,
      50 * canvasSize.ratio
    );
  }, []);

  // レスポンシブ対応の処理
  useLayoutEffect(() => {
    const updateSize = (): void => {
      const padding = 300;
      const minimumWidth = 300;

      // window.innerWidthに合わせてcanvasのサイズを変更する
      // ただし、最小値はminimumWidth
      // window.innerHeightに合わせてcanvasのサイズ変更は未実装
      if (window.innerWidth > padding + minimumWidth) {
        canvasSize.width = window.innerWidth - padding;
      } else {
        canvasSize.width = minimumWidth;
      }
      canvasSize.height = canvasSize.width - padding;
      canvasSize.ratio = canvasSize.width / CANVAS_WIDTH;
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return {
    player1,
    player2,
    paddle1,
    paddle2,
    ball,
    userCommand,
    canvasSize,
    keyDownEvent,
    keyUpEvent,
    draw,
  };
};
