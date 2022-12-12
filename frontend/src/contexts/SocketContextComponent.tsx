import React, {
  PropsWithChildren,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { Center, Spinner } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useSocket } from 'hooks/socket/useSocket';
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from './SocketContext';

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<
  ISocketContextComponentProps
> = (props) => {
  const { children } = props;

  const { user } = useProfile();

  const socket = useSocket('http://localhost:3000/', {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false,
  });

  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.connect();
    SocketDispatch({ type: 'update_socket', payload: socket });

    // 今はここでuserIdをセットしてる
    socket.emit('connect_user', user.id, (users: string[]) => {
      SocketDispatch({ type: 'update_users', payload: users });
    });
    SocketDispatch({ type: 'update_user', payload: user });
    // TODO: uidは必要か検討
    SocketDispatch({ type: 'update_uid', payload: user.id });

    setLoading(false);
    void StartListeners();

    return () => {
      socket.disconnect();
    };
  }, []);

  const StartListeners = () => {
    // サーバーでuserIdをセットする場合はこちらでuserId設定
    // socket.on('update_uid', (uid: string) => {
    //   SocketDispatch({ type: 'update_uid', payload: uid });
    // });

    socket.on('update_users', (users: string[]) => {
      SocketDispatch({ type: 'update_users', payload: users });
    });

    socket.on('user_connected', (users: string[]) => {
      console.log('User connected message received');
      SocketDispatch({ type: 'update_users', payload: users });
    });

    socket.on('user_disconnected', (uid: string) => {
      console.info('User disconnected message received');
      SocketDispatch({ type: 'remove_user', payload: uid });
    });
  };

  if (loading)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
