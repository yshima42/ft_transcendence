import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { parse } from 'cookie';
import { Server, Socket } from 'socket.io';
import {
  BallSpeedType,
  GameOutline,
  GamePhase,
  GameRoom,
  InvitationRoom,
  Player,
} from 'src/game/game.object';
import { GameService } from 'src/game/game.service';
import { PrismaService } from 'src/prisma/prisma.service';

enum Presence {
  ONLINE = 1,
  INGAME = 2,
}

@WebSocketGateway({ cors: { origin: 'http://localhost:5173/' } })
export class UsersGateway {
  public userIdToPresence: Map<string, Presence>;
  public userIdToGameRoomId: Map<string, string>;
  private readonly gameRooms: Map<string, GameRoom>;
  private readonly invitationRooms: Map<string, InvitationRoom>;

  constructor(
    private readonly gameService: GameService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {
    this.userIdToPresence = new Map<string, Presence>();
    this.userIdToGameRoomId = new Map<string, string>();
    this.gameRooms = new Map<string, GameRoom>();
    this.invitationRooms = new Map<string, InvitationRoom>();
  }

  @WebSocketServer()
  private readonly server!: Server;

  async handleConnection(@ConnectedSocket() socket: Socket): Promise<void> {
    try {
      const cookie: string | undefined = socket.handshake.headers.cookie;
      if (cookie === undefined) {
        throw new WsException('Authentication failed.');
      }
      const { accessToken } = parse(cookie);
      const payload = this.jwt.verify<{ id: string }>(accessToken, {
        secret: this.config.get('JWT_SECRET'),
      });
      const { id } = payload;
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (user === null) {
        throw new WsException('Authentication failed.');
      }
      socket.data.userId = user.id;
      await socket.join(user.id);

      // 別タブで出ている招待モーダルを全て閉じる。
      socket
        .to(user.id)
        .emit('close_invitation_alert', { invitationRoomId: null });
      socket.emit('connect_established');
      Logger.debug('connected: ' + socket.id);
    } catch (e) {
      if (e instanceof Error) {
        socket.emit('exception', { status: 'error', message: e.message });
      }
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<void> {
    const { userId } = socket.data as { userId: string };
    await socket.leave(userId);
    await socket.leave('matching');
    await this.leaveGameRoom(socket);
    await this.leaveInvitationRoom(socket);

    const userIdSockets = await this.server.in(userId).fetchSockets();
    if (userIdSockets.length === 0) {
      this.deletePresence(userId);
    }

    Logger.debug('disconnected: ' + socket.id);
  }

  @SubscribeMessage('handshake')
  handshake(@ConnectedSocket() socket: Socket): {
    userIdToPresence: Array<[string, Presence]>;
    userIdToGameRoomId: Array<[string, string]>;
  } {
    const { userId } = socket.data as { userId: string };
    const reconnected = this.userIdToPresence.has(userId);
    if (!reconnected) {
      this.addPresence(userId);
    }

    Logger.debug('handshake: ' + socket.id);

    return {
      userIdToPresence: [...this.userIdToPresence],
      userIdToGameRoomId: [...this.userIdToGameRoomId],
    };
  }

  @SubscribeMessage('join_matching_room')
  async randomMatch(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} join_matching_room`
    );

    const { userId } = socket.data as { userId: string };
    // ゲーム中に、/matching に直打ちアクセスされた場合、ゲームルームに飛ばす。
    const gameRoomId = this.userIdToGameRoomId.get(userId);
    if (gameRoomId !== undefined) {
      socket.emit('go_game_room', gameRoomId);

      return;
    }

    // 別タブで、マッチング中や招待中であれば、それをキャンセルする。
    socket.to(userId).emit('matching_room_error', 'Matching canceled.');
    socket.to(userId).emit('invitation_room_error', 'Invitation canceled.');

    const matchingSockets = await this.server.in('matching').fetchSockets();
    // 1人目の場合2人目ユーザーを待つ
    if (matchingSockets.length === 0) {
      await socket.join('matching');

      return;
    }
    const { userId: waitUserId } = matchingSockets[0].data as {
      userId: string;
    };
    if (userId === waitUserId) {
      await socket.join('matching');

      return;
    }

    const gameRoom = this.createGameRoom(waitUserId, userId);
    // matchingルームで待っているPlayer1に対してのemit
    this.server.to('matching').emit('go_game_room', gameRoom.id);
    this.server.socketsLeave('matching');
    // Player2に対してのemit
    socket.emit('go_game_room', gameRoom.id);
  }

  @SubscribeMessage('leave_matching_room')
  async cancelMatching(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} leave_matching_room`
    );

    await socket.leave('matching');
  }

  @SubscribeMessage('create_invitation_room')
  createInvitationRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: { opponentId: string; ballSpeedType: BallSpeedType }
  ): { invitationRoomId: string } {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} create_invitation_room`
    );

    const { userId } = socket.data as { userId: string };
    const { opponentId, ballSpeedType } = message;
    const invitationRoom = new InvitationRoom(
      userId,
      opponentId,
      ballSpeedType
    );
    this.invitationRooms.set(invitationRoom.id, invitationRoom);

    return { invitationRoomId: invitationRoom.id };
  }

  @SubscribeMessage('join_invitation_room')
  async joinInvitationRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: { invitationRoomId: string }
  ): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} join_invitation_room`
    );

    const { userId } = socket.data as { userId: string };
    const invitationRoom = this.invitationRooms.get(message.invitationRoomId);
    if (invitationRoom === undefined) {
      socket.emit('invitation_room_error', 'Invalid invitation room.');

      return;
    }
    socket.data.invitationRoomId = invitationRoom.id;
    // 別タブで、マッチング中や招待中であれば、それをキャンセルする。
    socket.to(userId).emit('matching_room_error', 'Matching canceled.');
    socket.to(userId).emit('invitation_room_error', 'Invitation canceled.');

    await socket.join(invitationRoom.id);
    // 招待中に、別タブ、直打ちで、同じinvitation_room に入れるため、1回だけemit。
    if (!invitationRoom.isAlreadyInvited) {
      invitationRoom.isAlreadyInvited = true;
      this.server.to(invitationRoom.player2Id).emit('receive_invitation', {
        invitationRoomId: invitationRoom.id,
        challengerId: userId,
        ballSpeedType: invitationRoom.ballSpeedType,
      });
    }
  }

  @SubscribeMessage('accept_invitation')
  accept_invitation(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: { invitationRoomId: string }
  ): { roomId: string | null } {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} accept_invitation`
    );

    // 別タブでモーダルがでているとき、全て閉じる
    const { userId } = socket.data as { userId: string };
    const { invitationRoomId } = message;
    socket.to(userId).emit('close_invitation_alert', { invitationRoomId });

    const invitationRoom = this.invitationRooms.get(invitationRoomId);
    if (invitationRoom === undefined) {
      return { roomId: null };
    }
    invitationRoom.isAlreadyReply = true;

    const { player1Id, player2Id, ballSpeedType } = invitationRoom;
    const gameRoom = this.createGameRoom(player1Id, player2Id, ballSpeedType);
    this.server
      .to(invitationRoom.id)
      .emit('go_game_room_by_invitation', gameRoom.id);

    return { roomId: gameRoom.id };
  }

  @SubscribeMessage('decline_invitation')
  declineInvitation(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: { invitationRoomId: string }
  ): void {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} declineInvitation`
    );

    // 別タブでモーダルがでているとき、全て閉じる
    const { userId } = socket.data as { userId: string };
    const { invitationRoomId } = message;
    socket.to(userId).emit('close_invitation_alert', { invitationRoomId });

    const invitationRoom = this.invitationRooms.get(invitationRoomId);
    if (invitationRoom === undefined) {
      return;
    }
    invitationRoom.isAlreadyReply = true;

    this.server.to(message.invitationRoomId).emit('player2_decline_invitation');
  }

  @SubscribeMessage('decline_invitation_for_ready_game')
  declineInvitationForReadyGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: { invitationRoomId: string }
  ): void {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} declineInvitationForReady`
    );

    const invitationRoom = this.invitationRooms.get(message.invitationRoomId);
    // 複数タブの場合、自動Decline で複数回やってくるので、１回のみ送信。
    if (invitationRoom === undefined || invitationRoom.isAlreadyReply) {
      return;
    }
    invitationRoom.isAlreadyReply = true;
    this.server
      .to(message.invitationRoomId)
      .emit('invitation_room_error', 'The opponent is ready for another game.');
  }

  @SubscribeMessage('leave_invitation_room')
  async handleLeaveInvitationRoom(
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} leave_invitation_room`
    );

    await this.leaveInvitationRoom(socket);
  }

  @SubscribeMessage('join_game_room')
  async joinRoom(
    @MessageBody() message: { roomId: string },
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    Logger.debug(`${socket.id} ${socket.data.userId as string} join_game_room`);

    const { roomId } = message;
    const gameRoom = this.gameRooms.get(roomId);
    if (gameRoom === undefined) {
      socket.emit('game_room_error', 'Invalid game room.');

      return;
    }
    socket.data.gameRoomId = roomId;

    const { userId } = socket.data as { userId: string };
    const { player1, player2 } = gameRoom;
    const isPlayer = player1.id === userId || player2.id === userId;
    await (isPlayer ? socket.join(roomId) : socket.join(`watch_${roomId}`));

    const gameInfo = {
      player1: { id: player1.id, score: player1.score },
      player2: { id: player2.id, score: player2.score },
      isPlayer,
      isLeftSide: true,
      readyCountDownNum: gameRoom.readyCountDownNum,
      nextGamePhase: GamePhase.ConfirmWaiting,
    };
    if (isPlayer) {
      const [me, opponent] =
        player1.id === userId ? [player1, player2] : [player2, player1];
      gameInfo.isLeftSide = me.isLeftSide;
      const judgeGamePhase = (): GamePhase => {
        if (!me.isReady) return GamePhase.ConfirmWaiting;
        else if (!opponent.isReady) return GamePhase.OpponentWaiting;
        else if (!gameRoom.isFinished) return GamePhase.InGame;
        else return GamePhase.Result;
      };
      gameInfo.nextGamePhase = judgeGamePhase();
    } else {
      const judgeGamePhase = (): GamePhase => {
        if (!gameRoom.isInGame) return GamePhase.PlayerWaiting;
        if (!gameRoom.isFinished) return GamePhase.Watch;
        else return GamePhase.Result;
      };
      gameInfo.nextGamePhase = judgeGamePhase();
    }

    socket.emit('set_game_info', gameInfo);
  }

  @SubscribeMessage('player_confirm')
  confirm(@ConnectedSocket() socket: Socket): void {
    Logger.debug(`${socket.id} ${socket.data.userId as string} player_confirm`);

    const { userId, gameRoomId: roomId } = socket.data as {
      userId: string;
      gameRoomId: string;
    };
    const gameRoom = this.gameRooms.get(roomId);
    if (gameRoom === undefined) {
      socket.emit('game_room_error', 'Invalid game room.');

      return;
    }

    const { player1, player2 } = gameRoom;
    const [me, opponent] =
      player1.id === userId ? [player1, player2] : [player2, player1];
    me.isReady = true;
    if (!opponent.isReady) {
      this.server
        .to(me.id)
        .emit('update_game_phase', GamePhase.OpponentWaiting);
    } else {
      this.server.in(roomId).emit('update_game_phase', GamePhase.InGame);
      this.server
        .in(`watch_${roomId}`)
        .emit('update_game_phase', GamePhase.Watch);
      // 1回のみ動かす
      if (!gameRoom.isInGame) {
        gameRoom.isInGame = true;
        gameRoom.gameStart(roomId);
      }
    }
  }

  // キー入力されたときに呼ばれる。
  @SubscribeMessage('user_command')
  handleUserCommands(
    @MessageBody()
    message: {
      userCommand: { up: boolean; down: boolean; isLeftSide: boolean };
    },
    @ConnectedSocket() socket: Socket
  ): void {
    const { gameRoomId: roomId } = socket.data as { gameRoomId: string };
    const gameRoom = this.gameRooms.get(roomId);
    if (gameRoom === undefined) {
      // 既に削除されてる場合があるので、エラー通知しない。
      return;
    }
    gameRoom.handleInput(message.userCommand);
  }

  @SubscribeMessage('leave_game_room')
  async handleLeaveGameRoom(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} leave_game_room`
    );

    await this.leaveGameRoom(socket);
  }

  @SubscribeMessage('join_monitor_room')
  async sendAllGameRoomIds(
    @ConnectedSocket() socket: Socket
  ): Promise<GameOutline[]> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} join_monitor_room`
    );

    await socket.join('monitor');
    const inGameOutlines: GameOutline[] = [];
    this.gameRooms.forEach((gameRoom) => {
      if (gameRoom.isFinished) return;
      inGameOutlines.push({
        roomId: gameRoom.id,
        player1Id: gameRoom.player1.id,
        player2Id: gameRoom.player2.id,
      });
    });

    return inGameOutlines;
  }

  @SubscribeMessage('leave_monitor_room')
  async leaveRoomList(@ConnectedSocket() socket: Socket): Promise<void> {
    Logger.debug(
      `${socket.id} ${socket.data.userId as string} leave_monitor_room`
    );

    await socket.leave('monitor');
  }

  async leaveGameRoom(socket: Socket): Promise<void> {
    const { userId, gameRoomId: roomId } = socket.data as {
      userId: string;
      gameRoomId: string | undefined;
    };
    if (roomId === undefined) {
      return;
    }
    socket.data.gameRoomId = undefined;
    const gameRoom = this.gameRooms.get(roomId);
    if (gameRoom === undefined) {
      return;
    }
    const { player1, player2 } = gameRoom;
    const isPlayer = player1.id === userId || player2.id === userId;
    await (isPlayer ? socket.leave(roomId) : socket.leave(`watch_${roomId}`));
    const gameRoomSockets = await this.server.in(roomId).fetchSockets();
    if (gameRoomSockets.length === 0) {
      // 両プレイヤーゲームルームを抜けたら無効試合
      if (!gameRoom.isFinished) {
        this.server
          .in(`watch_${roomId}`)
          .emit('game_room_error', 'Both players disconnected.');
        clearInterval(gameRoom.interval);
        this.deleteGameRoom(gameRoom);
      }
    }
  }

  async leaveInvitationRoom(socket: Socket): Promise<void> {
    const { invitationRoomId } = socket.data as {
      invitationRoomId: string | undefined;
    };
    if (invitationRoomId === undefined) {
      return;
    }
    socket.data.invitationRoomId = undefined;
    const invitationRoom = this.invitationRooms.get(invitationRoomId);
    if (invitationRoom === undefined) {
      return;
    }
    await socket.leave(invitationRoomId);
    const invitationRoomSockets = await this.server
      .in(invitationRoomId)
      .fetchSockets();
    if (invitationRoomSockets.length === 0) {
      // 返信きていない場合、モーダルを閉じてもらう。
      if (!invitationRoom.isAlreadyReply) {
        this.server
          .to(invitationRoom.player2Id)
          .emit('close_invitation_alert', { invitationRoomId });
      }
      this.invitationRooms.delete(invitationRoomId);
    }
  }

  createGameRoom(
    player1Id: string,
    player2Id: string,
    ballSpeedType?: BallSpeedType
  ): GameRoom {
    const gameRoom = new GameRoom(
      this.gameService,
      this.server,
      (gameRoom: GameRoom) => {
        this.deleteGameRoom(gameRoom);
      },
      new Player(player1Id, true),
      new Player(player2Id, false),
      ballSpeedType
    );
    this.gameRooms.set(gameRoom.id, gameRoom);

    this.updatePresence(player1Id, Presence.INGAME);
    this.addGameRoomId(player1Id, gameRoom.id);
    this.updatePresence(player2Id, Presence.INGAME);
    this.addGameRoomId(player2Id, gameRoom.id);
    this.server.to('monitor').emit('game_room_created', {
      roomId: gameRoom.id,
      player1Id,
      player2Id,
    });

    return gameRoom;
  }

  deleteGameRoom(gameRoom: GameRoom): void {
    const { id: roomId, player1, player2 } = gameRoom;

    this.gameRooms.delete(roomId);
    this.updatePresence(player1.id, Presence.ONLINE);
    this.updatePresence(player2.id, Presence.ONLINE);
    this.deleteGameRoomId(player1.id);
    this.deleteGameRoomId(player2.id);
    this.server.to('monitor').emit('game_room_deleted', roomId);
  }

  addPresence(userId: string): void {
    const isInGame = this.userIdToGameRoomId.has(userId);
    const presence = isInGame ? Presence.INGAME : Presence.ONLINE;
    this.userIdToPresence.set(userId, presence);
    this.server.emit('set_presence', [
      userId,
      this.userIdToPresence.get(userId),
    ]);
  }

  updatePresence(userId: string, presence: Presence): void {
    const isOnline = this.userIdToPresence.has(userId);
    if (isOnline) {
      this.userIdToPresence.set(userId, presence);
      this.server.emit('set_presence', [
        userId,
        this.userIdToPresence.get(userId),
      ]);
    }
  }

  deletePresence(userId: string): void {
    this.userIdToPresence.delete(userId);
    this.server.emit('delete_presence', userId);
  }

  addGameRoomId(userId: string, gameRoomId: string): void {
    this.userIdToGameRoomId.set(userId, gameRoomId);
    this.server.emit('set_game_room_id', [
      userId,
      this.userIdToGameRoomId.get(userId),
    ]);
  }

  deleteGameRoomId(userId: string): void {
    this.userIdToGameRoomId.delete(userId);
    this.server.emit('delete_game_room_id', userId);
  }
}
