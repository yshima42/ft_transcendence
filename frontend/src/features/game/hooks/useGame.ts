import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from 'providers/SocketProvider';
import {
  BALL_START_X,
  BALL_START_Y,
  BG_COLOR,
  CANVAS_WIDTH,
  PADDLE_START_POS,
  PADDLE_WIDTH,
} from '../utils/gameConfig';
import { Ball, Paddle } from '../utils/gameObjs';

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

export type GameResult = {
  player1Nickname: string;
  player2Nickname: string;
  player1Score: number;
  player2Score: number;
};

const defaultGameResult: GameResult = {
  player1Nickname: '',
  player2Nickname: '',
  player1Score: 0,
  player2Score: 0,
};

// ここでuseRefを使ってsocketのconnect処理ができたら理想
export const useGame = (
  roomId: string
): {
  gamePhase: GamePhase;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  draw: (ctx: CanvasRenderingContext2D) => void;
  gameResult: GameResult;
} => {
  const [gamePhase, setGamePhase] = useState(GamePhase.SocketConnecting);
  const [gameResult, setGameResult] = useState(defaultGameResult);
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('SocketContext undefined');
  }
  const { socket, connected } = socketContext;
  const navigate = useNavigate();

  const player1 = new Paddle(0, PADDLE_START_POS);
  const player2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
  const ball = new Ball(BALL_START_X, BALL_START_Y);

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

  const userCommand = {
    up: false,
    down: false,
    isLeftSide: true,
  };
  let justPressed = false;

  const keyDownEvent = (e: KeyboardEvent) => {
    if (e.key === 'Down' || e.key === 'ArrowDown') {
      if (!userCommand.down) {
        justPressed = true;
      }
      userCommand.down = true;
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
      if (!userCommand.up) {
        justPressed = true;
      }
      userCommand.up = true;
    }
    if (justPressed) {
      socket.emit('user_command', { userCommand });
      justPressed = false;
    }
  };

  const keyUpEvent = (e: KeyboardEvent) => {
    if (e.key === 'Down' || e.key === 'ArrowDown') {
      userCommand.down = false;
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
      userCommand.up = false;
    }
  };

  // socket イベント
  useEffect(() => {
    socket.on('invalid_room', () => {
      console.log('[Socket Event] invalid_room');
      // state は、useToastCheck に合わせる。
      navigate('/app', {
        state: {
          toastProps: { description: 'Invalid game room.', status: 'error' },
        },
      });
    });

    socket.on('both_players_disconnected', () => {
      console.log('[Socket Event] both_players_disconnected');
      navigate('/app', {
        state: {
          toastProps: {
            description: 'Both players disconnected.',
            status: 'error',
          },
        },
      });
    });

    socket.on('set_side', (isLeftSide: boolean) => {
      console.log('[Socket Event] set_side');
      userCommand.isLeftSide = isLeftSide;
    });

    socket.on('check_confirmation', () => {
      console.log('[Socket Event] check_confirmation');
      setGamePhase(GamePhase.ConfirmWaiting);
    });

    socket.on('wait_opponent', () => {
      console.log('[Socket Event] wait_opponent');
      setGamePhase(GamePhase.OpponentWaiting);
    });

    socket.on('start_game', () => {
      console.log('[Socket Event] start_game');
      document.addEventListener('keydown', keyDownEvent, false);
      document.addEventListener('keyup', keyUpEvent, false);
      setGamePhase(GamePhase.InGame);
    });

    // ゲーム中のスコア受け取り
    socket.on(
      'update_score',
      (data: { player1Score: number; player2Score: number }) => {
        player1.score = data.player1Score;
        player2.score = data.player2Score;
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
        player1.x = data.paddle1X;
        player1.y = data.paddle1Y;
        player2.x = data.paddle2X;
        player2.y = data.paddle2Y;
        ball.x = data.ballX;
        ball.y = data.ballY;
      }
    );

    socket.on('done_game', (gameResult: GameResult) => {
      setGameResult(gameResult);
      setGamePhase(GamePhase.Result);
    });

    socket.on('wait_players', () => {
      setGamePhase(GamePhase.PlayerWaiting);
    });

    socket.on('watch_game', () => {
      setGamePhase(GamePhase.Watch);
    });

    return () => {
      socket.emit('leave_room');
      socket.off('invalid_room');
      socket.off('both_players_disconnected');
      socket.off('set_side');
      socket.off('check_confirmation');
      socket.off('wait_opponent');
      socket.off('start_game');
      socket.off('done_game');
      socket.off('update_score');
      socket.off('position_update');
      socket.off('wait_players');
      socket.off('watch');
      document.removeEventListener('keydown', keyDownEvent, false);
      document.removeEventListener('keyup', keyUpEvent, false);
    };
  }, [socket, navigate]);

  // 各ページのLogic
  useEffect(() => {
    switch (gamePhase) {
      case GamePhase.SocketConnecting: {
        if (connected) {
          setGamePhase(GamePhase.Joining);
        }
        break;
      }
      case GamePhase.Joining: {
        console.log('[GamePhase] Joining');
        socket.emit('join_room', { roomId });
        break;
      }
      case GamePhase.ConfirmWaiting: {
        console.log('[GamePhase] ConfirmWaiting');
        break;
      }
      case GamePhase.Confirming: {
        console.log('[GamePhase] Confirming');
        socket.emit('confirm');
        break;
      }
      case GamePhase.OpponentWaiting: {
        console.log('[GamePhase] OpponentWaiting');
        break;
      }
      case GamePhase.InGame: {
        console.log('[GamePhase] InGame');
        socket.emit('connect_pong');
        break;
      }
      case GamePhase.Result: {
        console.log('[GamePhase] Result');
        break;
      }
      case GamePhase.PlayerWaiting: {
        console.log('[GamePhase] PlayerWaiting');
        break;
      }
      case GamePhase.Watch: {
        console.log('[GamePhase] Watch');
        break;
      }
    }
  }, [gamePhase, socket, roomId, connected]);

  return { gamePhase, setGamePhase, draw, gameResult };
};
