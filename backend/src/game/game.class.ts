import { BALL_COLOR, BALL_SIZE, BALL_SPEED } from './config/game-config';

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

export class GameRoom {
  id: string;
  player1Id: string;
  player2Id: string;

  constructor(id: string, player1Id: string, player2Id: string) {
    this.id = id;
    this.player1Id = player1Id;
    this.player2Id = player2Id;
  }
}

export type GameRoomDict = {
  [id: string]: GameRoom;
};