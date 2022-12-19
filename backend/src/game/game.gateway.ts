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
import { GameRoom, Player } from './game.object';
import { GameService } from './game.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/game' })
export class GameGateway {
  // gameServiceを使うのに必要

  @WebSocketServer()
  private readonly server!: Server;

  // このクラスで使う配列・変数
  private readonly gameRooms: Map<string, GameRoom>;
  private readonly matchWaitingPlayers: Player[] = [];

  constructor(private readonly gameService: GameService) {
    this.gameRooms = new Map<string, GameRoom>();
  }

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
    const { userId, userNickName } = socket.data as {
      userId: string;
      userNickName: string;
    };
    // 1人目の場合2人目ユーザーを待つ
    if (this.matchWaitingPlayers.length === 0) {
      const newPlayer = new Player(socket, userId, userNickName, true);
      this.matchWaitingPlayers.push(newPlayer);
    } else {
      const player1 = this.matchWaitingPlayers[0];
      // どちらでもやること同じだけどpop()を採用した
      // this.matchWaitingPlayers.splice(0, 1);
      this.matchWaitingPlayers.pop();

      const player2 = new Player(socket, userId, userNickName, false);
      // 2人揃ったらマッチルーム作る
      const roomId = this.createGameRoom(player1, player2);

      this.server
        .to(player1.socket.id)
        .emit('go_game_room', roomId, player1.isLeftSide);
      this.server
        .to(player2.socket.id)
        .emit('go_game_room', roomId, player2.isLeftSide);
    }
  }

  createGameRoom(player1: Player, player2: Player): string {
    const id = uuidv4();
    const gameRoom = new GameRoom(
      this.gameService,
      id,
      this.server,
      player1,
      player2
    );
    this.gameRooms.set(id, gameRoom);

    return id;
  }

  @SubscribeMessage('matching_cancel')
  cancelMatching(@ConnectedSocket() socket: Socket): void {
    const { userId } = socket.data as { userId: string };
    const foundIndex = this.matchWaitingPlayers.findIndex(
      (player) => player.id === userId
    );
    if (foundIndex !== undefined) {
      this.matchWaitingPlayers.splice(foundIndex, 1);
    }
  }

  // room関連;
  @SubscribeMessage('join_room')
  async joinRoom(
    @MessageBody() message: { roomId: string },
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    await socket.join(message.roomId);
    console.log(`joinRoom: ${socket.id} joined ${message.roomId}`);

    socket.emit('check_confirmation');
  }

  @SubscribeMessage('confirm')
  confirm(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: { roomId: string }
  ): void {
    const gameRoom = this.gameRooms.get(message.roomId);
    if (gameRoom !== undefined) {
      gameRoom.ready
        ? this.server.in(message.roomId).emit('start_game')
        : (gameRoom.ready = true);
    }
  }

  @SubscribeMessage('connect_pong')
  connectPong(
    @MessageBody() message: { roomId: string },
    @ConnectedSocket() socket: Socket
  ): void {
    // player1のsocketでゲームオブジェクトを作る
    const gameRoom = this.gameRooms.get(message.roomId);
    if (gameRoom !== undefined) {
      if (socket.id === gameRoom.player2.socket.id) {
        return;
      }
      // ゲーム開始
      gameRoom.gameStart(socket, message.roomId);
    }

    // TODO: ゲーム終了後、gameRoomを削除する処理を入れる
  }

  // deleteGameRoom(roomId: string): void {
  //   this.gameRooms[roomId].disconnectAll();
  //   // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  //   delete this.gameRooms[roomId];
  // }

  @SubscribeMessage('user_command')
  handleUserCommands(
    @MessageBody()
    data: {
      roomId: string;
      userCommand: { up: boolean; down: boolean; isLeftSide: boolean };
    }
  ): void {
    const gameRoom = this.gameRooms.get(data.roomId);
    if (gameRoom !== undefined) {
      gameRoom.handleInput(data.roomId, data.userCommand);
    }
  }
}
