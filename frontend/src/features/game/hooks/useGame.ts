import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from 'providers/SocketProvider';
import { BACKEND_CANVAS_WIDTH, BG_COLOR } from '../utils/gameConfig';
import { Ball, Paddle } from '../utils/gameObjs';
import { useWindowSize } from './useWindowSize';

export enum GamePhase {
  SocketConnecting = 0,
  Joining = 1,
  ConfirmWaiting = 2,
  Confirming = 3,
  OpponentWaiting = 4,
  InGame = 5,
  Result = 6,
  PlayerWaiting = 7,
  Watch = 8,
}

export type Player = {
  id: string;
  score: number;
};

// ここでuseRefを使ってsocketのconnect処理ができたら理想
export const useGame = (
  roomId: string
): {
  gamePhase: GamePhase;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  draw: (ctx: CanvasRenderingContext2D) => void;
  player1: Player;
  player2: Player;
  readyCountDownNum: number;
} => {
  const [gamePhase, setGamePhase] = useState(GamePhase.SocketConnecting);
  const [readyCountDownNum, setReadyCountDownNum] = useState<number>(0);

  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('SocketContext undefined');
  }
  const { socket, connected } = socketContext;
  const navigate = useNavigate();

  const player1: Player = useMemo(() => ({ id: '', score: 0 }), []);
  const player2: Player = useMemo(() => ({ id: '', score: 0 }), []);
  const paddle1 = useMemo(() => new Paddle(), []);
  const paddle2 = useMemo(() => new Paddle(), []);
  const ball = useMemo(() => new Ball(), []);
  // const { canvasWidth } = useCanvasSize();
  const size = useWindowSize();

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // canvas背景の設定
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // ゲームオブジェクトの表示
    paddle1.draw(ctx);
    paddle2.draw(ctx);
    ball.draw(ctx);

    // スコアの表示
    ctx.font = '48px serif';
    ctx.fillText(player1.score.toString(), 20, 50);
    ctx.fillText(player2.score.toString(), BACKEND_CANVAS_WIDTH - 40, 50);
  }, []);

  const userCommand = useMemo(
    () => ({ up: false, down: false, isLeftSide: true }),
    []
  );

  const keyDownEvent = useCallback((e: KeyboardEvent) => {
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

  // socket イベント
  useEffect(() => {
    socket.on('game_room_error', (message: string) => {
      // state は、useToastCheck に合わせる。
      navigate('/app', {
        state: {
          toastProps: { description: message, status: 'error' },
        },
      });
    });

    socket.on(
      'set_game_info',
      (message: {
        player1: { id: string; score: number };
        player2: { id: string; score: number };
        isLeftSide: boolean;
        readyCountDownNum: number;
        nextGamePhase: GamePhase;
      }) => {
        console.log('[Socket Event] set_game_info');
        player1.id = message.player1.id;
        player2.id = message.player2.id;
        player1.score = message.player1.score;
        player2.score = message.player2.score;
        userCommand.isLeftSide = message.isLeftSide;
        setReadyCountDownNum(message.readyCountDownNum);
        setGamePhase(message.nextGamePhase);
      }
    );

    socket.on('update_ready_count_down_num', (newCountDownNum: number) => {
      console.log('[Socket Event] update_ready_count_down_num');
      setReadyCountDownNum(newCountDownNum);
    });

    socket.on('update_game_phase', (nextGamePhase: GamePhase) => {
      console.log(`[Socket Event] update_game_phase ${nextGamePhase}`);
      setGamePhase(nextGamePhase);
    });

    // ゲーム中のスコア受け取り
    socket.on(
      'update_score',
      (message: { player1Score: number; player2Score: number }) => {
        player1.score = message.player1Score;
        player2.score = message.player2Score;
      }
    );

    // ゲームで表示するオブジェクトのポジション受け取り
    socket.on(
      'update_position',
      (message: {
        paddle1X: number;
        paddle1Y: number;
        paddle2X: number;
        paddle2Y: number;
        ballX: number;
        ballY: number;
      }) => {
        [paddle1.x, paddle1.y] = [
          message.paddle1X * ((size[0] - 300) / BACKEND_CANVAS_WIDTH),
          message.paddle1Y * ((size[0] - 300) / BACKEND_CANVAS_WIDTH),
        ];
        [paddle2.x, paddle2.y] = [
          message.paddle2X * ((size[0] - 300) / BACKEND_CANVAS_WIDTH),
          message.paddle2Y * ((size[0] - 300) / BACKEND_CANVAS_WIDTH),
        ];
        [ball.x, ball.y] = [
          message.ballX * ((size[0] - 300) / BACKEND_CANVAS_WIDTH),
          message.ballY * ((size[0] - 300) / BACKEND_CANVAS_WIDTH),
        ];
      }
    );

    return () => {
      socket.emit('leave_game_room');
      socket.off('game_room_error');
      socket.off('set_game_info');
      socket.off('update_ready_count_down_num');
      socket.off('update_game_phase');
      socket.off('update_score');
      socket.off('update_position');
    };
  }, [socket, navigate]);

  // 各ページのLogic
  useEffect(() => {
    switch (gamePhase) {
      case GamePhase.SocketConnecting: {
        if (connected) setGamePhase(GamePhase.Joining);
        break;
      }
      case GamePhase.Joining: {
        console.log('[GamePhase] Joining');
        socket.emit('join_game_room', { roomId });
        break;
      }
      case GamePhase.ConfirmWaiting: {
        break;
      }
      case GamePhase.Confirming: {
        socket.emit('player_confirm');
        break;
      }
      case GamePhase.OpponentWaiting: {
        break;
      }
      case GamePhase.InGame: {
        socket.emit('connect_pong');
        document.addEventListener('keydown', keyDownEvent, false);
        document.addEventListener('keyup', keyUpEvent, false);
        break;
      }
      case GamePhase.Result: {
        break;
      }
      case GamePhase.PlayerWaiting: {
        break;
      }
      case GamePhase.Watch: {
        break;
      }
    }

    return () => {
      document.removeEventListener('keydown', keyDownEvent, false);
      document.removeEventListener('keyup', keyUpEvent, false);
    };
  }, [gamePhase, socket, roomId, connected, keyDownEvent, keyUpEvent]);

  return { gamePhase, setGamePhase, draw, player1, player2, readyCountDownNum };
};
