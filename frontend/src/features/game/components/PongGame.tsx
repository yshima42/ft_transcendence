import { memo, FC } from 'react';
import { useGame } from '../hooks/useGame';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../utils/gameConfig';
import { Canvas } from './Canvas';

// export type StartGame = {
//   start: boolean;
//   isLeftSide: boolean;
// };

// type Props = {
//   setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
// };

// export const PongGame: FC<Props> = memo((props) => {
// const player1 = new Paddle(0, PADDLE_START_POS);
// const player2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
// const ball = new Ball(BALL_START_X, BALL_START_Y);

// const { isLeftSide, isGameStarted, setGameStarted, roomName } =
//   props.gameContextValue;
// const [doneGame, setDoneGame] = useState(false);

// useEffect(() => {
//   const socket = socketService.socket;
//   if (socket === null) return;

//   // ゲームスタート処理
//   socket.on('start_game', () => {
//     setGameStarted(true);

//     socket.emit('connect_pong', { roomId: roomName });
//   });

//   // ゲーム終了処理
//   socket.on('done_game', () => {
//     setDoneGame(true);
//   });

//   // プレーヤー操作
//   // TODO: player1だけになってるのを修正
//   userInput(socket, roomName, player1, isLeftSide);

//   // スコア受け取り
//   socket.on(
//     'update_score',
//     (data: { paddle1Score: number; paddle2Score: number }) => {
//       player1.score = data.paddle1Score;
//       player2.score = data.paddle2Score;
//     }
//   );

//   // ゲームで表示するオブジェクトのポジション受け取り
//   socket.on(
//     'position_update',
//     (data: {
//       paddle1X: number;
//       paddle1Y: number;
//       paddle2X: number;
//       paddle2Y: number;
//       ballX: number;
//       ballY: number;
//     }) => {
//       player1.pos.x = data.paddle1X;
//       player1.pos.y = data.paddle1Y;
//       player2.pos.x = data.paddle2X;
//       player2.pos.y = data.paddle2Y;
//       ball.pos.x = data.ballX;
//       ball.pos.y = data.ballY;
//     }
//   );

//   return () => {
//     socket?.off('start_game');
//     socket?.off('done_game');
//     socket?.off('update_score');
//     socket?.off('position_update');
//   };
// }, []);

export const PongGame: FC = memo(() => {
  const { draw } = useGame();

  return <Canvas draw={draw} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />;
});
