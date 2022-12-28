import { useWindowSize } from './useWindowSize';

export const useCanvasSize = (): {
  canvasWidth: number;
  canvasHeight: number;
} => {
  // TODO: heightを使って比率計算する
  const [width] = useWindowSize();
  const canvasWidth = width - 300;
  const canvasHeight = (width - 300) / 2;

  return { canvasWidth, canvasHeight };
};
