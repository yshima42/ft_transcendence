import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// const games: Socket[] = [];

@WebSocketGateway({ cors: { origin: '*' } })
export class RoomGateway {
  @WebSocketServer()
  server!: Server;

  handleConnection(@ConnectedSocket() socket: Socket): void {
    console.log(socket.id);
  }

  private readonly logger: Logger = new Logger('Gateway Log');

  // @SubscribeMessage('message')
  // handleMessage(
  //   @MessageBody() message: string,
  //   @ConnectedSocket() socket: Socket
  // ): void {
  //   this.logger.log(`message recieved ${message}`);
  //   const rooms = [...socket.rooms].slice(0);
  //   this.server.to(rooms[1]).emit('update', message);
  // }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    this.logger.log(`joinRoom: ${socket.id} joined ${roomId}`);
    const connectedSockets = this.server.sockets.adapter.rooms.get(roomId);
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    if (
      socketRooms.length > 0 ||
      (connectedSockets != null && connectedSockets.size === 2)
    ) {
      socket.emit('roomJoinError', {
        error: 'Room is full',
      });
    } else {
      await socket.join(roomId);
      socket.emit('roomJoined');
    }
  }

  private getSocketGameRoom(socket: Socket): string {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    const gameRoom = socketRooms?.[0];

    return gameRoom;
  }

  @SubscribeMessage('update')
  handleUpdate(
    @MessageBody() pos: { x: number; y: number },
    @ConnectedSocket() socket: Socket
  ): void {
    const gameRoom = this.getSocketGameRoom(socket);
    console.log(pos);
    socket.to(gameRoom).emit('onGameUpdate', pos);
  }
}
