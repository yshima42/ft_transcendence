import { useContext, createContext, useState } from 'react';
import { SOCKET_URL } from 'config/default';
import io, { Socket } from 'socket.io-client';

// TODO: 現在は使っていないが、chat等を作る時、こちらを使ってsocketを作るのが良いのかも。必要なければ削除。
// 参考: https://zenn.dev/ttaktt/articles/5d5e8b00b16119
interface Context {
  socket: Socket;
  setUsername: () => void;
  messages?: Array<{ message: string; username: string; time: string }>;
  setMessages: () => void;
}

// SOCKET_URLの中身のところに接続を要求
const socket = io(SOCKET_URL);

const SocketContext = createContext<Context>({
  socket,
  setUsername: () => false,
  setMessages: () => false,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const SocketsProvider = (props: any): JSX.Element => {
  const [messages, setMessages] = useState([]);

  return (
    <SocketContext.Provider
      value={{ socket, messages, setMessages }}
      {...props}
    />
  );
};

export const useSockets = (): Context => useContext(SocketContext);

export default SocketsProvider;
