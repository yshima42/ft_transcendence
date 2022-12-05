import { SOCKET_URL } from 'config/default';
import { io } from 'socket.io-client';
import { Paddle } from './objs';

const socket = io(SOCKET_URL);

export const userInput = (obj: Paddle): void => {
  document.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (e.key === 'Down' || e.key === 'ArrowDown') {
        obj.down = true;
      } else if (e.key === 'Up' || e.key === 'ArrowUp') {
        obj.up = true;
      }
      emitUserCommands(obj);
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
      emitUserCommands(obj);
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
