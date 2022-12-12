import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// eslint-disable-next-line import/extensions

@WebSocketGateway({ cors: { origin: '*' } })
export class UsersGateway {
  public onlineUsers: { [id: string]: string };
  public inGameUsers: { [id: string]: string };
  public onWaitUsers: { [id: string]: string };

  // gameServiceを使うのに必要
  constructor() {
    // オンラインユーザー一覧
    this.onlineUsers = {};
    this.inGameUsers = {};
    this.onWaitUsers = {};
  }

  @WebSocketServer()
  private readonly server!: Server;

  handleConnection(@ConnectedSocket() socket: Socket): void {
    console.log('connected: ' + socket.id);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): string[] {
    console.log('disconnected: ' + socket.id);
    const uid = this.GetUidFromSocketID(socket.id);
    if (uid != null) {
      // TODO: ここのeslint回避がわからない、できれば修正したい(shimazu)
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.onlineUsers[uid];
    }

    const onlineUsers = Object.values(this.onlineUsers);

    this.SendMessage(
      socket,
      'user_disconnected',
      onlineUsers.filter((id) => id !== socket.id),
      onlineUsers
    );

    return onlineUsers;
  }

  @SubscribeMessage('connect_user')
  handshake(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string
  ): string[] {
    console.log(userId);
    this.onlineUsers[userId] = socket.id;

    const onlineUsers = Object.values(this.onlineUsers);

    this.SendMessage(
      socket,
      'user_connected',
      onlineUsers.filter((id) => id !== socket.id),
      onlineUsers
    );

    return onlineUsers;
  }

  GetUidFromSocketID = (id: string): string | undefined => {
    return Object.keys(this.onlineUsers).find(
      (uid) => this.onlineUsers[uid] === id
    );
  };

  SendMessage = (
    socket: Socket,
    name: string,
    onlineUsers: string[],
    payload?: unknown
  ): void => {
    onlineUsers.forEach((id) =>
      payload != null
        ? socket.to(id).emit(name, payload)
        : socket.to(id).emit(name)
    );
  };
}
