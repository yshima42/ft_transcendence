import { useCallback, useLayoutEffect, useMemo } from 'react';
import { Socket } from 'socket.io-client';
import { BG_COLOR, CANVAS_WIDTH } from '../utils/gameConfig';
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
  canvas: {
    width: number;
    height: number;
    ratio: number;
    draw: (ctx: CanvasRenderingContext2D) => void;
  };
  keyDownEvent: (e: KeyboardEvent) => void;
  keyUpEvent: (e: KeyboardEvent) => void;
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
  const canvas = useMemo(
    () => ({
      width: 0,
      height: 0,
      ratio: 0,
      draw: (ctx: CanvasRenderingContext2D) => {
        // canvas背景の設定
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        paddle1.draw(ctx, canvas.ratio);
        paddle2.draw(ctx, canvas.ratio);
        ball.draw(ctx, canvas.ratio);
        player1.drawScore(ctx, canvas.ratio, true);
        player2.drawScore(ctx, canvas.ratio, false);
      },
    }),
    []
  );

  const keyDownEvent = useCallback(
    (e: KeyboardEvent) => {
      // 押したままでも発火するため、1回のみemit。
      if (userCommand.down || userCommand.up) {
        return;
      }
      if (e.key === 'Down' || e.key === 'ArrowDown') {
        userCommand.down = true;
      } else if (e.key === 'Up' || e.key === 'ArrowUp') {
        userCommand.up = true;
      }
      socket.emit('user_command', { userCommand });
    },
    [socket, userCommand]
  );

  const keyUpEvent = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Down' || e.key === 'ArrowDown') {
        userCommand.down = false;
      } else if (e.key === 'Up' || e.key === 'ArrowUp') {
        userCommand.up = false;
      }
    },
    [userCommand]
  );

  // レスポンシブ対応の処理
  useLayoutEffect(() => {
    const updateSize = (): void => {
      const padding = 300;
      const minimumWidth = 300;

      // window.innerWidthに合わせてcanvasのサイズを変更する
      // ただし、最小値はminimumWidth
      // window.innerHeightに合わせてcanvasのサイズ変更は未実装
      if (window.innerWidth > padding + minimumWidth) {
        canvas.width = window.innerWidth - padding;
      } else {
        canvas.width = minimumWidth;
      }
      canvas.height = canvas.width - padding;
      canvas.ratio = canvas.width / CANVAS_WIDTH;
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, [canvas]);

  return {
    player1,
    player2,
    paddle1,
    paddle2,
    ball,
    userCommand,
    canvas,
    keyDownEvent,
    keyUpEvent,
  };
};
