import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  BALL_SIZE,
  BALL_START_X,
  BALL_START_Y,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_SPEED,
  PADDLE_START_POS,
  PADDLE_WIDTH,
} from '../events/gameConfig';
import { Ball, Paddle } from '../events/objs';

type Players = {
  [key: string]: { x?: number; y?: number; up?: boolean; down?: boolean };
};

const players: Players = {};

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger: Logger = new Logger('Gateway Log');

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
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
      this.logger.log(`joinRoom: ${socket.id} joined ${roomId}`);

      if (this.server.sockets.adapter.rooms.get(roomId)?.size === 2) {
        socket.emit('startGame', { start: true, side: 'right' });
        socket.to(roomId).emit('startGame', { start: false, side: 'left' });
      }
    }
  }

  player1 = new Paddle(0, PADDLE_START_POS);
  player2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
  ball = new Ball(BALL_START_X, BALL_START_Y);

  // handleConnection内はconnectionが確立されたら実行される
  // handleConnection(@ConnectedSocket() socket: Socket): void {}

  private getSocketGameRoom(socket: Socket): string {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    const gameRoom = socketRooms?.[0];

    return gameRoom;
  }

  @SubscribeMessage('connectPong')
  handleNewPlayer(@ConnectedSocket() socket: Socket): void {
    const scoring = (player: Paddle) => {
      player.score++;
      // console.log('hi');
      // TODO: player nameをつけて誰のスコアかわかるように
      // socket.emit('scoreUpdate', { score: player.score });
    };

    // TODO: roomつける時に有効化
    // const gameRoom = this.getSocketGameRoom(socket);

    setInterval(() => {
      // パドルで跳ね返る処理・ゲームオーバー処理
      // TODO: 壁で跳ね返る処理はcanvasのwallを使えるかも
      if (this.ball.pos.x + this.ball.dx > CANVAS_WIDTH - BALL_SIZE) {
        if (
          this.ball.pos.y > this.player2.pos.y &&
          this.ball.pos.y < this.player2.pos.y + PADDLE_HEIGHT
        ) {
          this.ball.dx = -this.ball.dx;
        } else {
          scoring(this.player1);
          this.ball.setPosition(BALL_START_X, BALL_START_Y);
        }
      } else if (this.ball.pos.x + this.ball.dx < BALL_SIZE) {
        if (
          this.ball.pos.y > this.player1.pos.y &&
          this.ball.pos.y < this.player1.pos.y + PADDLE_HEIGHT
        ) {
          this.ball.dx = -this.ball.dx;
        } else {
          scoring(this.player2);
          this.ball.setPosition(BALL_START_X, BALL_START_Y);
        }
      }

      // ボールの動き
      if (
        this.ball.pos.y + this.ball.dy > CANVAS_HEIGHT - BALL_SIZE ||
        this.ball.pos.y + this.ball.dy < BALL_SIZE
      ) {
        this.ball.dy = -this.ball.dy;
      }

      // frameごとに進む
      this.ball.pos.x += this.ball.dx * 0.2;
      this.ball.pos.y += this.ball.dy * 0.2;

      // TODO: 後ほどルームIDつける
      // socket.to(gameRoom).emit('player1Update', {
      socket.emit('player1Update', {
        x: this.player1.pos.x,
        y: this.player1.pos.y,
      });
      // socket.to(gameRoom).emit('player2Update', {
      socket.emit('player2Update', {
        x: this.player2.pos.x,
        y: this.player2.pos.y,
      });
      // socket.to(gameRoom).emit('ballUpdate', {
      socket.emit('ballUpdate', {
        x: this.ball.pos.x,
        y: this.ball.pos.y,
      });
    }, 33);
    console.log(`new client: ${socket.id}`);

    // socket.to(gameRoom).emit('connectedPlayer', socket.id);
    socket.emit('connectedPlayer', socket.id);
  }

  @SubscribeMessage('userCommands')
  handleUserCommands(
    @MessageBody() data: { up: boolean; down: boolean; side: 'left' | 'right' },
    @ConnectedSocket() socket: Socket
  ): void {
    // player1操作
    if (data.side === 'left' && data.down) {
      this.player1.pos.y += PADDLE_SPEED;
      if (this.player1.pos.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
        this.player1.pos.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }
    } else if (data.side === 'left' && data.up) {
      this.player1.pos.y -= PADDLE_SPEED;
      if (this.player1.pos.y < 0) {
        this.player1.pos.y = 0;
      }
    }

    // player2操作
    if (data.side === 'right' && data.down) {
      this.player2.pos.y += PADDLE_SPEED;
      if (this.player2.pos.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
        this.player2.pos.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }
    } else if (data.side === 'right' && data.up) {
      this.player2.pos.y -= PADDLE_SPEED;
      if (this.player2.pos.y < 0) {
        this.player2.pos.y = 0;
      }
    }
    players[socket.id] = data;
    console.log(data);
  }
}
