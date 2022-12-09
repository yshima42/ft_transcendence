import { Socket } from 'socket.io';

export type Position = {
  x: number;
  y: number;
};

export type Ball = {
  up: boolean;
  down: boolean;
  pos: Position;
  speed: { dx: number; dy: number };
};

export type Paddle = {
  id: string;
  up: boolean;
  down: boolean;
  pos: Position;
  score: number;
  speed: { dx: number; dy: number };
};

export type SocketData = {
  isLeftSide: boolean;
  client: Socket;
  userId: string;
  userName: string;
  gameId: string;
};

export type UserDict = {
  [id: string]: SocketData;
};
