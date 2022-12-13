import { Server } from 'socket.io';
import {
  BALL_COLOR,
  BALL_SIZE,
  BALL_SPEED,
  BALL_START_X,
  BALL_START_Y,
  CANVAS_WIDTH,
  PADDLE_START_POS,
  PADDLE_WIDTH,
} from './config/game-config';
import { UserData } from './game.interface';

export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export class Ball {
  up: boolean;
  down: boolean;
  pos: { x: number; y: number };
  dx: number;
  dy: number;

  constructor(x: number, y: number) {
    this.pos = new Vector(x, y);
    this.up = false;
    this.down = false;
    this.dx = BALL_SPEED;
    this.dy = -BALL_SPEED;
  }

  draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = BALL_COLOR;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, BALL_SIZE, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  };

  setPosition = (x: number, y: number): void => {
    this.pos.x = x;
    this.pos.y = y;
  };
}

export class Paddle {
  id: string;
  role: 'Player1' | 'Player2';
  up: boolean;
  down: boolean;
  pos: { x: number; y: number };
  score: number;
  dx: number;
  dy: number;

  constructor(x: number, y: number) {
    this.id = '';
    this.role = 'Player1';
    this.pos = new Vector(x, y);
    this.up = false;
    this.down = false;
    this.score = 0;
    this.dx = 0;
    this.dy = 0;
  }
}

// TODO: ここにプレーヤームーブを入れる
export class GameRoom {
  id: string;
  server: Server;
  player1: UserData;
  player2: UserData;
  ball: Ball;
  paddle1: Paddle;
  paddle2: Paddle;

  constructor(
    id: string,
    server: Server,
    player1: UserData,
    player2: UserData
  ) {
    this.id = id;
    this.server = server;
    this.player1 = player1;
    this.player2 = player2;
    this.paddle1 = new Paddle(0, PADDLE_START_POS);
    this.paddle2 = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, PADDLE_START_POS);
    this.ball = new Ball(BALL_START_X, BALL_START_Y);
  }
}

export type GameRoomDict = {
  [id: string]: GameRoom;
};
