import { useCallback, useLayoutEffect, useMemo } from 'react';
import { Socket } from 'socket.io-client';
import { BG_COLOR, CANVAS_HEIGHT, CANVAS_WIDTH } from '../utils/gameConfig';
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
      const xPadding = 300;
      const yPadding = 160;
      const minimumWidth = 300;
      const maxWidth = 780;
      const canvasRatio = CANVAS_HEIGHT / CANVAS_WIDTH;

      // window.innerWidth、window.innerHeightに合わせてcanvasのサイズを変更する
      // ただし、widthの最小値はminimumWidth、最大値はmaxWidth
      if (
        window.innerWidth < minimumWidth + xPadding ||
        window.innerHeight < (minimumWidth + xPadding) * canvasRatio
      ) {
        canvas.width = minimumWidth;
      } else if (
        window.innerWidth > maxWidth + xPadding &&
        window.innerHeight > (maxWidth + xPadding) * canvasRatio
      ) {
        canvas.width = maxWidth;
      } else if (
        (window.innerWidth - xPadding) * canvasRatio <
        window.innerHeight - yPadding
      ) {
        canvas.width = window.innerWidth - xPadding;
      } else {
        canvas.width = (window.innerHeight - yPadding) / canvasRatio;
      }
      canvas.height = canvas.width * canvasRatio;
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
