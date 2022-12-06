import { createContext } from 'react';

export type GameContextProps = {
  isInRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  side: 'left' | 'right';
  setSide: (role: 'left' | 'right') => void;
  isGameStarted: boolean;
  setGameStarted: (started: boolean) => void;
};

const defaultState: GameContextProps = {
  isInRoom: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setInRoom: () => {},
  side: 'left',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSide: () => {},
  isGameStarted: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setGameStarted: () => {},
};

export default createContext(defaultState);
