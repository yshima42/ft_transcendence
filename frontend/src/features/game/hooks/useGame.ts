import { useEffect, useState } from 'react';
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
  // const [player1, setPlayer1] = useState(new Paddle(0, PADDLE_START_POS));
  // const [player2, setPlayer2] = useState(
  //   new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS)
  // );
  // const [ball, setBall] = useState(new Ball(BALL_START_X, BALL_START_Y));
  const player1 = new Paddle(0, PADDLE_START_POS);
  const player2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
  const ball = new Ball(BALL_START_X, BALL_START_Y);

  // TODO: socket はとりあえずの仮実装
  const [socket] = useState(io('http://localhost:3000/game'));
  const { user } = useProfile();

  const draw = (ctx: CanvasRenderingContext2D) => {
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
  };

  useEffect(() => {
    switch (gamePhase) {
      case GamePhase.Top: {
        break;
      }
      case GamePhase.Matching: {
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
        socket.emit('set_user', user);
        socket.emit('random_match');
        break;
      }
      case GamePhase.WaitStart: {
        break;
      }
      case GamePhase.InGame: {
        socket.on('done_game', () => {
          setGamePhase(GamePhase.Result);
        });

        // プレーヤー操作
        // TODO: player1だけになってるのを修正
        userInput(socket, roomId, player1, isLeftSide);

        // スコア受け取り
        socket.on(
          'update_score',
          (data: { paddle1Score: number; paddle2Score: number }) => {
            console.log('update____score');

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
            console.log('postion updateeeeeeeeeeeeeee');
            player1.pos.x = data.paddle1X;
            player1.pos.y = data.paddle1Y;
            player2.pos.x = data.paddle2X;
            player2.pos.y = data.paddle2Y;
            ball.pos.x = data.ballX;
            ball.pos.y = data.ballY;
          }
        );
        break;
      }
      case GamePhase.Result:
        break;
      default:
        throw new Error();
    }
  }, [gamePhase, user, socket]);

  return { gamePhase, setGamePhase, draw };
};
