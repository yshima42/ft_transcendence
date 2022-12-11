import { Socket } from 'socket.io';

export type Position = {
  x: number;
  y: number;
};

export type Velocity = {
  dx: number;
  dy: number;
};

export type Ball = {
  up: boolean;
  down: boolean;
  pos: Position;
  velocity: Velocity;
};

export type Paddle = {
  id: string;
  up: boolean;
  down: boolean;
  pos: Position;
  score: number;
  velocity: Velocity;
};

export type UserData = {
  isLeftSide?: boolean;
  socket: Socket;
  id: string;
  nickname: string;
  inGame: boolean;
};

export type UserDict = {
  [id: string]: UserData;
};
