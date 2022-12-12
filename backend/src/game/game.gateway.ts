import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
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
// TODO: 名前変更
// eslint-disable-next-line import/extensions
import { Ball, GameRoom, GameRoomDict, Paddle } from './game.class';
import { UserData } from './game.interface';
import { GameService } from './game.service';

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
  public onlineUsers: { [id: string]: string };
  public inGameUsers: { [id: string]: string };
  public onWaitUsers: { [id: string]: string };

  // gameServiceを使うのに必要
  constructor(private readonly gameService: GameService) {
    // オンラインユーザー一覧
    this.onlineUsers = {};
    this.inGameUsers = {};
    this.onWaitUsers = {};
  }

  @WebSocketServer()
  private readonly server!: Server;

  // このクラスで使う配列・変数
  private readonly gameRooms: GameRoomDict = {};
  private readonly matchWaitingUsers: UserData[] = [];

  // サーバー側でのオブジェクト作成
  player1 = new Paddle(0, PADDLE_START_POS);
  player2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
  ball = new Ball(BALL_START_X, BALL_START_Y);

  // 現在接続してるsocketのroomIdを取得
  getSocketGameRoom = (socket: Socket): string => {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    console.log(socketRooms);
    const gameRoom = socketRooms?.[0];

    return gameRoom;
  };

  // 本来はhandleConnectionでやりたいが、authGuardで対応できないため、こちらでUser情報セット
  @SubscribeMessage('set_user')
  setUserToSocket(
    @MessageBody() user: User,
    @ConnectedSocket() socket: Socket
  ): void {
    // socket.dataに情報を登録
    socket.data.userId = user.id;
    socket.data.userNickname = user.nickname;
  }

  @SubscribeMessage('random_match')
  randomMatch(@ConnectedSocket() socket: Socket): void {
    const userData: UserData = {
      socket,
      id: socket.data.userId as string,
      nickname: socket.data.userNickname as string,
      inGame: true,
    };
    // 1人目の場合2人目ユーザーを待つ
    if (this.matchWaitingUsers.length === 0) {
      userData.isLeftSide = true;
      this.matchWaitingUsers.push(userData);
    } else {
      // 2人揃ったらマッチルーム作る
      userData.isLeftSide = false;
      const roomId = this.createGameRoom(this.matchWaitingUsers[0], userData);

      // TODO: このemitのやり方微妙な気がするので修正
      this.server.to(socket.id).emit('go_game_room', roomId);
      this.server
        .to(this.matchWaitingUsers[0].socket.id)
        .emit('go_game_room', roomId);

      this.matchWaitingUsers.splice(0, 1);
    }
  }

  createGameRoom(player1: UserData, player2: UserData): string {
    const id = uuidv4();
    const gameRoom = new GameRoom(id, this.server, player1, player2);
    this.gameRooms[id] = gameRoom;

    return id;
  }

  // room関連;
  @SubscribeMessage('join_room')
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
      socket.emit('room_join_error', {
        error: 'Room is full',
      });
    } else {
      await socket.join(message.roomId);
      socket.emit('room_joined');
      console.log(`joinRoom: ${socket.id} joined ${message.roomId}`);

      if (this.server.sockets.adapter.rooms.get(message.roomId)?.size === 2) {
        socket.emit('start_game', { start: true, isLeftSide: false });
        socket
          .to(message.roomId)
          .emit('start_game', { start: false, isLeftSide: true });
      }
    }
  }

  @SubscribeMessage('connect_pong')
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
        // 結果をデータベースに保存
        // const muchResult: CreateMatchResultDto = {
        //   playerOneId: 'e8f67e5d-47fb-4a0e-8a3b-aa818eb3ce1a',
        //   playerTwoId: 'c89ae673-b6fb-415e-9389-5276bbba7a4c',
        //   playerOneScore: this.player1.score,
        //   playerTwoScore: this.player2.score,
        // };
        // await this.gameService.addMatchResult(muchResult);

        socket.to(gameRoom).emit('done_game', {
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
      socket.to(gameRoom).emit('player1_update', {
        x: this.player1.pos.x,
        y: this.player1.pos.y,
        score: this.player1.score,
      });
      socket.to(gameRoom).emit('player2_update', {
        x: this.player2.pos.x,
        y: this.player2.pos.y,
        score: this.player2.score,
      });
      socket.to(gameRoom).emit('ball_update', {
        x: this.ball.pos.x,
        y: this.ball.pos.y,
      });
    }, 33);

    socket.emit('init_return');
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

  @SubscribeMessage('user_commands')
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
