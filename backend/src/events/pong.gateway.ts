import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

// const games: Socket[] = [];

type Players = {
  [key: string]: string;
};

const players: Players = {};

@WebSocketGateway({ cors: { origin: '*' } })
export class PongGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger: Logger = new Logger('Gateway Log');

  @SubscribeMessage('newPlayer')
  handleNewPlayer(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket
  ): void {
    console.log(`new client: ${socket.id}`);
    players[socket.id] = data;
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete players[socket.id];
    console.log(`good-bye client: ${socket.id}`);
  }

  // @SubscribeMessage('events')
  // handleEvent(@MessageBody() message: string): void {
  //   this.server.emit('events', message);
  // }

  // @SubscribeMessage('events')
  // onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
  //   const event = 'events';
  //   const response = [1, 2, 3];

  //   return from(response).pipe(map((data) => ({ event, data })));
  // }
}
