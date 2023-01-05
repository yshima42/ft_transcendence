import { useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from 'providers/SocketProvider';
import { Player } from '../utils/gameObjs';
import { useGameObjs } from './useGameObjs';

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

export const useGame = (
  roomId: string
): {
  gamePhase: GamePhase;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  player1: Player;
  player2: Player;
  readyCountDownNum: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
  canvasSize: { width: number; height: number; ratio: number };
} => {
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('SocketContext undefined');
  }
  const { socket, connected } = socketContext;

  const [gamePhase, setGamePhase] = useState(GamePhase.SocketConnecting);
  const [readyCountDownNum, setReadyCountDownNum] = useState<number>(0);
  const [isPlayer, setIsPlayer] = useState(true);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { customToast } = useCustomToast();
  const {
    player1,
    player2,
    userCommand,
    paddle1,
    paddle2,
    ball,
    canvasSize,
    keyDownEvent,
    keyUpEvent,
    draw,
  } = useGameObjs(socket);

  // socket イベント
  useEffect(() => {
    socket.on('game_room_error', (message: string) => {
      customToast({ description: message });
      navigate('/app');
    });

    socket.on(
      'set_game_info',
      (message: {
        player1: { id: string; score: number };
        player2: { id: string; score: number };
        isPlayer: boolean;
        isLeftSide: boolean;
        readyCountDownNum: number;
        nextGamePhase: GamePhase;
      }) => {
        console.log('[Socket Event] set_game_info');
        player1.id = message.player1.id;
        player2.id = message.player2.id;
        player1.score = message.player1.score;
        player2.score = message.player2.score;
        setIsPlayer(message.isPlayer);
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

    socket.on(
      'update_score',
      (message: { player1Score: number; player2Score: number }) => {
        player1.score = message.player1Score;
        player2.score = message.player2Score;
      }
    );

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
          message.paddle1X * canvasSize.ratio,
          message.paddle1Y * canvasSize.ratio,
        ];
        [paddle2.x, paddle2.y] = [
          message.paddle2X * canvasSize.ratio,
          message.paddle2Y * canvasSize.ratio,
        ];
        [ball.x, ball.y] = [
          message.ballX * canvasSize.ratio,
          message.ballY * canvasSize.ratio,
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

  // 各フェーズのLogic
  useEffect(() => {
    switch (gamePhase) {
      case GamePhase.SocketConnecting: {
        if (connected) {
          setGamePhase(GamePhase.Joining);
        }
        break;
      }
      case GamePhase.Joining: {
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
        const invalidQueryKeys = [
          [`/users/${player1.id}/game/matches`],
          [`/users/${player2.id}/game/matches`],
          [`/users/${player1.id}/game/stats`],
          [`/users/${player2.id}/game/stats`],
        ];
        if (isPlayer) {
          invalidQueryKeys.push([`/game/matches`], ['/game/stats']);
        }
        void queryClient.invalidateQueries({ queryKey: invalidQueryKeys });
        break;
      }
      // 観戦者用
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
  }, [gamePhase, socket, roomId, connected, isPlayer, queryClient]);

  return {
    gamePhase,
    setGamePhase,
    player1,
    player2,
    readyCountDownNum,
    draw,
    canvasSize,
  };
};
