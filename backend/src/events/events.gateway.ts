// import { Logger } from '@nestjs/common';
// import {
//   ConnectedSocket,
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Socket, Server } from 'socket.io';

// const games: Socket[] = [];

// @WebSocketGateway({ cors: { origin: '*' } })
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class EventsGateway {
  // @WebSocketServer()
  // server!: Server;
  // handleConnection(@ConnectedSocket() socket: Socket): void {
  //   console.log(socket.id);
  //   //   const game = null;
  //   //   for (let i = 0; i < games.length; i++) {
  //   //     if (games[i].length < 2) {
  //   //       game = i;
  //   //     }
  //   //   }
  //   //   if (game === null) {
  //   //     games.push([]);
  //   //     game = games.length - 1;
  //   //   }
  //   //   games[game].push(socket);
  //   //   socket.set('game', game);
  //   //   if (games[game].length == 2) {
  //   //     games[game][0].set('partner', socket);
  //   //     games[game][1].set('partner', games[game][0]);
  //   //     games[game][0].emit('master');
  //   //     games[game][1].emit('slave');
  //   //   }
  // }
  // private readonly logger: Logger = new Logger('Gateway Log');
  // @SubscribeMessage('message')
  // handleMessage(
  //   @MessageBody() message: string,
  //   @ConnectedSocket() socket: Socket
  // ): void {
  //   this.logger.log(`message recieved ${message}`);
  //   const rooms = [...socket.rooms].slice(0);
  //   this.server.to(rooms[1]).emit('update', message);
  // }
  // @SubscribeMessage('joinRoom')
  // joinOrUpdateRoom(
  //   @MessageBody() roomId: string,
  //   @ConnectedSocket() socket: Socket
  // ): void {
  //   this.logger.log(`joinRoom: ${socket.id} joined ${roomId}`);
  //   const rooms = [...socket.rooms].slice(0);
  //   if (rooms.length === 2) void socket.leave(rooms[1]);
  //   void socket.join(roomId);
  // }
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
