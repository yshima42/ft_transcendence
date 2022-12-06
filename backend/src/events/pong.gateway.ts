import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
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
} from './gameConfig';
import { Ball, Paddle } from './objs';

// const games: Socket[] = [];

type Players = {
  [key: string]: { x?: number; y?: number; up?: boolean; down?: boolean };
};

const players: Players = {};

@WebSocketGateway({ cors: { origin: '*' } })
export class PongGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger: Logger = new Logger('Gateway Log');

  player1 = new Paddle(0, PADDLE_START_POS);
  player2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
  ball = new Ball(BALL_START_X, BALL_START_Y);

  // ボールの動き
  // 上下の壁で跳ね返る処理

  // handleConnection内はconnectionが確立されたら実行される
  handleConnection(@ConnectedSocket() socket: Socket): void {
    const scoring = (player: Paddle) => {
      player.score++;
    };

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
      this.ball.pos.x += this.ball.dx * 0.07;
      this.ball.pos.y += this.ball.dy * 0.07;

      socket.emit('player1Update', {
        x: this.player1.pos.x,
        y: this.player1.pos.y,
      });
      socket.emit('ballUpdate', {
        x: this.ball.pos.x,
        y: this.ball.pos.y,
      });
    }, 33);
  }

  @SubscribeMessage('newPlayer')
  handleNewPlayer(
    @MessageBody() pos: { x: number; y: number },
    @ConnectedSocket() socket: Socket
  ): void {
    console.log(`new client: ${socket.id}`);
    players[socket.id] = pos;
    console.log(pos);
    socket.emit('updatePlayers', players);
    socket.emit('updatePos', players);
  }

  @SubscribeMessage('userCommands')
  handleUserCommands(
    @MessageBody() data: { up: boolean; down: boolean },
    @ConnectedSocket() socket: Socket
  ): void {
    if (data.down) {
      this.player1.pos.y += PADDLE_SPEED;
      if (this.player1.pos.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
        this.player1.pos.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }
    } else if (data.up) {
      this.player1.pos.y -= PADDLE_SPEED;
      if (this.player1.pos.y < 0) {
        this.player1.pos.y = 0;
      }
    }
    players[socket.id] = data;
    console.log(data);
  }
}
