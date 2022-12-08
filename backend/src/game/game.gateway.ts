import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { Ball, GameRooms, Paddle } from './classes/game-objs';
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
} from './config/game-config';
import { GameService } from './game.service';

type GameScore = {
  player1: number;
  player2: number;
};

// const finishGame = async (player1: Paddle, player2: Paddle) => {
//   return await new Promise((resolve) => {
//     if (player1.score === 5) {
//       resolve('player1');
//     } else if (player2.score === 5) {
//       resolve('player2');
//     }
//   });
// };

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway {
  @WebSocketServer()
  private readonly server!: Server;

  private readonly gameRooms: GameRooms = {};

  // サーバー側でのオブジェクト作成
  player1 = new Paddle(0, PADDLE_START_POS);
  player2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
  ball = new Ball(BALL_START_X, BALL_START_Y);

  private readonly gameScore: GameScore = { player1: 0, player2: 0 };

  // 現在接続してるsocketのroomIdを取得
  getSocketGameRoom = (socket: Socket): string => {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    console.log(socketRooms);
    const gameRoom = socketRooms?.[0];

    return gameRoom;
  };

  // room関連
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() message: { roomId: string },
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    const connectedSockets = this.server.sockets.adapter.rooms.get(
      message.roomId
    );
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
      await socket.join(message.roomId);
      socket.emit('roomJoined');
      console.log(`joinRoom: ${socket.id} joined ${message.roomId}`);

      if (this.server.sockets.adapter.rooms.get(message.roomId)?.size === 2) {
        socket.emit('startGame', { start: true, isLeftSide: false });
        socket
          .to(message.roomId)
          .emit('startGame', { start: false, isLeftSide: true });
      }
    }
  }

  @SubscribeMessage('connectPong')
  handleConnectPong(@ConnectedSocket() socket: Socket): void {
    const gameRoom = this.getSocketGameRoom(socket);

    // console.log(`new client: ${socket.id}`);

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
          this.player1.score++;
          this.ball.setPosition(BALL_START_X, BALL_START_Y);
        }
      } else if (this.ball.pos.x + this.ball.dx < BALL_SIZE) {
        if (
          this.ball.pos.y > this.player1.pos.y &&
          this.ball.pos.y < this.player1.pos.y + PADDLE_HEIGHT
        ) {
          this.ball.dx = -this.ball.dx;
        } else {
          this.player2.score++;
          this.ball.setPosition(BALL_START_X, BALL_START_Y);
        }
      }

      // ゲーム終了
      if (this.player1.score === 5 || this.player2.score === 5) {
        // const service =new GameService().addMatchResult()
        socket.to(gameRoom).emit('doneGame', {
          player1score: this.player1.score,
          player2score: this.player2.score,
        });
        this.player1.score = 0;
        this.player2.score = 0;
      }

      // ボールの動き
      if (
        this.ball.pos.y + this.ball.dy > CANVAS_HEIGHT - BALL_SIZE ||
        this.ball.pos.y + this.ball.dy < BALL_SIZE
      ) {
        this.ball.dy = -this.ball.dy;
      }

      // frameごとに進む
      this.ball.pos.x += this.ball.dx * 0.5;
      this.ball.pos.y += this.ball.dy * 0.5;

      // frameごとにplayer1,2,ballの位置を送信
      socket.to(gameRoom).emit('player1Update', {
        x: this.player1.pos.x,
        y: this.player1.pos.y,
        score: this.player1.score,
      });
      socket.to(gameRoom).emit('player2Update', {
        x: this.player2.pos.x,
        y: this.player2.pos.y,
        score: this.player2.score,
      });
      socket.to(gameRoom).emit('ballUpdate', {
        x: this.ball.pos.x,
        y: this.ball.pos.y,
      });
    }, 33);

    socket.emit('initReturn');
  }

  // @SubscribeMessage('tick')
  // handleNewPlayer(@ConnectedSocket() socket: Socket): void {
  //   // ゲーム終了処理
  //   const doneGame = finishGame(this.player1, this.player2);
  //   doneGame
  //     .then((data) => {
  //       socket.emit('doneGame', {
  //         winner: data,
  //       });
  //       this.player1.score = 0;
  //       this.player2.score = 0;
  //     })
  //     // eslint-disable-next-line @typescript-eslint/no-empty-function
  //     .catch(() => {});
  // }

  @SubscribeMessage('userCommands')
  handleUserCommands(
    @MessageBody() data: { up: boolean; down: boolean; isLeftSide: boolean }
  ): void {
    // player1操作
    if (data.isLeftSide && data.down) {
      this.player1.pos.y += PADDLE_SPEED;
      if (this.player1.pos.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
        this.player1.pos.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }
    } else if (data.isLeftSide && data.up) {
      this.player1.pos.y -= PADDLE_SPEED;
      if (this.player1.pos.y < 0) {
        this.player1.pos.y = 0;
      }
    }

    // player2操作
    if (!data.isLeftSide && data.down) {
      this.player2.pos.y += PADDLE_SPEED;
      if (this.player2.pos.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
        this.player2.pos.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }
    } else if (!data.isLeftSide && data.up) {
      this.player2.pos.y -= PADDLE_SPEED;
      if (this.player2.pos.y < 0) {
        this.player2.pos.y = 0;
      }
    }

    // TODO: 最後に消す
    console.log(data);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    console.log(socket.id);
  }
}
