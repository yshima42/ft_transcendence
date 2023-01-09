import * as React from 'react';
import { io, Socket } from 'socket.io-client';

// socket.io-clientのsocketを作成するカスタムフック
export const useSocket = (uri: string): Socket => {
  // socketを作成する (初回のみ)
  // autoConnect: false にすることで、socketを作成しただけでは接続しないようにする
  // transports: ['websocket'] にすることで、websocketのみを使用するようにする
  const { current: socket } = React.useRef<Socket>(
    io(uri, {
      autoConnect: false,
      transports: ['websocket'],
    })
  );

  // socketを破棄する
  React.useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return socket;
};
