import { useCallback, useEffect, useState } from 'react';
import { useProfile } from 'hooks/api';
import { io } from 'socket.io-client';
import {
  BALL_START_X,
  BALL_START_Y,
  BG_COLOR,
  CANVAS_WIDTH,
  PADDLE_START_POS,
  PADDLE_WIDTH,
} from '../utils/gameConfig';
import { Ball, Paddle } from '../utils/gameObjs';
import { userInput } from '../utils/userInput';

export enum GamePhase {
  Top = 0,
  Matching = 1,
  // Confim = 2,
  WaitStart = 3,
  InGame = 4,
  Result = 5,
}

// ここでuseRefを使ってsocketのconnect処理ができたら理想
export const useGame = (): {
  gamePhase: GamePhase;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  draw: (ctx: CanvasRenderingContext2D) => void;
} => {
  const [gamePhase, setGamePhase] = useState(GamePhase.Top);
  const [roomId, setRoomId] = useState('');
  const [isLeftSide, setIsLeftSide] = useState(true);
  // TODO: socket はとりあえずの仮実装
  const [socket] = useState(io('http://localhost:3000/game'));
  const { user } = useProfile();

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

  // socket イベント
  useEffect(() => {
    socket.on('go_game_room', (roomId: string, isLeftSide: boolean) => {
      setRoomId(roomId);
      setIsLeftSide(isLeftSide);
      setGamePhase(GamePhase.WaitStart);
      socket.emit('join_room', { roomId });
      socket.emit('connect_pong', { roomId });
    });

    socket.on('start_game', () => {
      setGamePhase(GamePhase.InGame);
    });

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

    socket.on('done_game', () => {
      setGamePhase(GamePhase.Result);
    });

    return () => {
      socket.off('go_game_room');
      socket.off('start_game');
      socket.off('done_game');
      socket.off('update_score');
      socket.off('position_update');
    };
  }, [socket]);

  // 各ページのLogic
  useEffect(() => {
    switch (gamePhase) {
      case GamePhase.Matching: {
        socket.emit('set_user', user);
        socket.emit('random_match');
        break;
      }
      case GamePhase.InGame: {
        userInput(socket, roomId, player1, isLeftSide);
        break;
      }
    }
  }, [gamePhase, user, socket]);

  return { gamePhase, setGamePhase, draw };
};
