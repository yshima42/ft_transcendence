import { createContext } from 'react';

export type GameContextProps = {
  isInRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  player: 'one' | 'two';
  setPlayer: (player: 'one' | 'two') => void;
};

const defaultState: GameContextProps = {
  isInRoom: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setInRoom: () => {},
  player: 'one',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPlayer: () => {},
};

export default createContext(defaultState);
