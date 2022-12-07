import { Socket } from 'socket.io-client';
import { StartGame } from '../components/PongGame';

class GameService {
  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      socket.emit('joinRoom', { roomId });
      socket.on('roomJoined', () => resolve(true));
      socket.on('roomJoinError', (error) => reject(error));
    });
  }

  // public async updateGame(socket: Socket) {
  //   socket.emit('update');
  // }

  // public onGameUpdate(socket: Socket, listener: (matrix: string) => void) {
  //   socket.on('onGameUpdate', ({ matrix }) => listener(matrix));
  // }

  public onStartGame(socket: Socket, listener: (options: StartGame) => void) {
    socket.on('startGame', listener);
  }
}

export default new GameService();
