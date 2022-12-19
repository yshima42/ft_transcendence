import { Socket } from 'socket.io-client';
import { Paddle } from './gameObjs';

const emitUserCommands = (
  socket: Socket,
  roomId: string,
  obj: Paddle,
  isLeftSide: boolean
) => {
  const userCommands = {
    up: obj.up,
    down: obj.down,
    isLeftSide,
  };
  socket.emit('user_commands', { roomId, userCommands });
};

// emitの回数を減らすため
let justPressed = false;
export const userInput = (
  socket: Socket | undefined,
  roomName: string,
  obj: Paddle,
  isLeftSide: boolean
): void => {
  if (socket == null) return;
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
        if (socket != null) {
          void emitUserCommands(socket, roomName, obj, isLeftSide);
          justPressed = false;
        }
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
        if (socket != null) {
          void emitUserCommands(socket, roomName, obj, isLeftSide);
        }
      }
    },
    false
  );
};
