import { Socket } from 'socket.io-client';
import { StartGame } from '../components/PongGame';
import { Paddle } from './gameObjs';

class GameService {
  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      socket.emit('join_room', { roomId });
      socket.on('room_joined', () => resolve(true));
      socket.on('room_join_error', (error) => reject(error));
    });
  }

  public async emitUserCommands(
    socket: Socket,
    obj: Paddle,
    isLeftSide: boolean
  ) {
    const userCommands = {
      up: obj.up,
      down: obj.down,
      isLeftSide,
    };

    return await new Promise(() => {
      socket.emit('user_commands', userCommands);
    });
  }

  // public onGameUpdate(socket: Socket, listener: (matrix: string) => void) {
  //   socket.on('onGameUpdate', ({ matrix }) => listener(matrix));
  // }

  public onStartGame(socket: Socket, listener: (options: StartGame) => void) {
    socket.on('start_game', listener);
  }
}

export default new GameService();
