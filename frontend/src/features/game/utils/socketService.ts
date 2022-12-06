import { io, Socket } from 'socket.io-client';

class SocketService {
  public socket: Socket | null = null;

  public async connect(url: string) {
    return await new Promise((resolve, reject) => {
      this.socket = io(url);

      this.socket.on('connect', () => {
        resolve(this.socket);
      });

      this.socket.on('connect_error', (err) => {
        console.log('Connection error: ', err);
        reject(err);
      });
    });
  }
}

export default new SocketService();