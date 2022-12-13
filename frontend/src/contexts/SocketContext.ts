import { createContext } from 'react';
import { User } from '@prisma/client';
import { Socket } from 'socket.io-client';

export interface ISocketContextState {
  socket: Socket | undefined;
  user: User | undefined;
  uid: string;
  users: string[];
}

export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  user: undefined,
  uid: '',
  users: [],
};

export type TSocketContextActions =
  | 'update_socket'
  | 'update_user'
  | 'update_uid'
  | 'update_users'
  | 'remove_user';

export type TSocketContextPayload = string | User | string[] | Socket;

export interface ISocketContextActions {
  type: TSocketContextActions;
  payload: TSocketContextPayload;
}

export const SocketReducer = (
  state: ISocketContextState,
  action: ISocketContextActions
): ISocketContextState => {
  // console.log(
  //   'Message received - Action: ' + action.type + ' - Payload: ',
  //   action.payload
  // );

  // TODO: update_in_game_usersを追加するか検討
  switch (action.type) {
    case 'update_socket':
      return { ...state, socket: action.payload as Socket };
    case 'update_user':
      return { ...state, user: action.payload as unknown as User };
    case 'update_uid':
      return { ...state, uid: action.payload as string };
    case 'update_users':
      return { ...state, users: action.payload as string[] };
    case 'remove_user':
      return {
        ...state,
        users: state.users.filter((uid) => uid !== (action.payload as string)),
      };
    default:
      return state;
  }
};

export interface ISocketContextProps {
  SocketState: ISocketContextState;
  SocketDispatch: React.Dispatch<ISocketContextActions>;
}

const SocketContext = createContext<ISocketContextProps>({
  SocketState: defaultSocketContextState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  SocketDispatch: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
