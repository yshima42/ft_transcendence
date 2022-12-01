import { memo, FC } from 'react';
import { Button, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
// import io from 'socket.io-client';
import { ContentLayout } from 'components/layout/ContentLayout';
import { Canvas } from './Canvas';

// const socket = io.connect('http://localhost:3000');

export const Game: FC = memo(() => {
  //   const sendMessage = () => {
  //     socket.emit('message', { message: 'hello' });
  //   };

  //   useEffect(() => {
  //     socket.on('message', (message) => {
  //       alert(message);

  //       return () => {
  //         socket.off('receive_message');
  //       };
  //     });
  //   }, []);
  // // contextを状態として持つ
  // const [context, setContext] = useState(null);
  // // コンポーネントの初期化完了後コンポーネント状態にコンテキストを登録
  // useEffect(() => {
  //   const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
  //   const canvasContext = canvas.getContext('2d');
  //   setContext(canvasContext);
  // }, []);

  // // 状態にコンテキストが登録されたらそれに対して操作できる
  // const draw = () => {
  //   let x = 10 / 2;
  //   let y = 100 - 30;
  //   const dx = 2;
  //   const dy = -2;

  //   context.beginPath();
  //   context.arc(x, y, 10, 0, Math.PI * 2, false);
  //   context.fillStyle = '#FF0000';
  //   context.fill();
  //   context.closePath();
  //   x += dx;
  //   y += dy;
  // };

  // useEffect(() => {
  //   if (context !== null) {
  //   }
  // }, [context]);

  return (
    <ContentLayout>
      <Center>
        <Canvas />
      </Center>
      <Center>
        <input placeholder="Message..." />
        <Button> send</Button>
        <Link to="/app">
          <Button>Back</Button>
        </Link>
      </Center>
    </ContentLayout>
  );
});
