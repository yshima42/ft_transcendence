import { Socket } from 'socket.io-client';

// emitの回数を減らすため
let justPressed = false;
export const userInput = (
  socket: Socket | undefined,
  roomId: string,
  isLeftSide: boolean
): void => {
  const userCommand = {
    up: false,
    down: false,
    isLeftSide,
  };
  if (socket == null) return;
  document.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (e.key === 'Down' || e.key === 'ArrowDown') {
        if (!userCommand.down) {
          justPressed = true;
        }
        userCommand.down = true;
      } else if (e.key === 'Up' || e.key === 'ArrowUp') {
        if (!userCommand.up) {
          justPressed = true;
        }
        userCommand.up = true;
      }
      if (justPressed) {
        if (socket != null) {
          socket.emit('user_command', { userCommand });
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
        userCommand.down = false;
      } else if (e.key === 'Up' || e.key === 'ArrowUp') {
        userCommand.up = false;
      }
      if (justPressed) {
        if (socket != null) {
          socket.emit('user_command', { userCommand });
        }
      }
    },
    false
  );
};
