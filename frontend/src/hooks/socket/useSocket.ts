import { useEffect, useRef } from 'react';
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

// TODO: 現在は使っていないが、chat等を作る時、こちらを使ってsocketを作るのが良いのかも。必要なければ削除。
// 参考: https://www.youtube.com/watch?v=-aTWWl4klYE
export const useSocket = (
  uri: string,
  opts?: Partial<ManagerOptions & SocketOptions> | undefined
): Socket => {
  const { current: socket } = useRef(
    io(uri, {
      transports: ['websocket'],
      ...opts,
    })
  );

  useEffect(() => {
    socket.connect();

    return () => {
      if (socket != null) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return socket;
};
