import { SOCKET_URL } from 'config/default';
import { io } from 'socket.io-client';
import { Paddle } from './objs';

const socket = io(SOCKET_URL);
// emitの回数を減らすため
let justPressed = false;

export const userInput = (obj: Paddle): void => {
  document.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (e.key === 'Down' || e.key === 'ArrowDown') {
        if (!obj.down) {
          justPressed = true;
        }
        obj.down = true;
      } else if (e.key === 'Up' || e.key === 'ArrowUp') {
        if (!obj.up) {
          justPressed = true;
        }
        obj.up = true;
      }
      if (justPressed) {
        emitUserCommands(obj);
        justPressed = false;
      }
    },
    false
  );

  document.addEventListener(
    'keyup',
    (e: KeyboardEvent) => {
      if (e.key === 'Down' || e.key === 'ArrowDown') {
        obj.down = false;
      } else if (e.key === 'Up' || e.key === 'ArrowUp') {
        obj.up = false;
      }
      if (justPressed) {
        emitUserCommands(obj);
      }
    },
    false
  );
};

export const emitUserCommands = (obj: Paddle): void => {
  const userCommands = {
    up: obj.up,
    down: obj.down,
  };
  socket.emit('userCommands', userCommands);
};
