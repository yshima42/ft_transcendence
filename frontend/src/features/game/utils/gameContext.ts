import { createContext } from 'react';

export type GameContextProps = {
  isInRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  player: 'one' | 'two';
  setPlayer: (player: 'one' | 'two') => void;
  isGameStarted: boolean;
  setGameStarted: (started: boolean) => void;
};

const defaultState: GameContextProps = {
  isInRoom: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setInRoom: () => {},
  player: 'one',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPlayer: () => {},
  isGameStarted: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setGameStarted: () => {},
};

export default createContext(defaultState);
