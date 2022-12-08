import { createContext } from 'react';

export type GameContextProps = {
  isInRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  isLeftSide: boolean;
  setLeftSide: (role: boolean) => void;
  isGameStarted: boolean;
  setGameStarted: (started: boolean) => void;
};

const defaultState: GameContextProps = {
  isInRoom: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setInRoom: () => {},
  isLeftSide: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLeftSide: () => {},
  isGameStarted: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setGameStarted: () => {},
};

export default createContext(defaultState);
