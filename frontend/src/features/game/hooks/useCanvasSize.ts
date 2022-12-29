import { useWindowSize } from './useWindowSize';

export const useCanvasSize = (): {
  canvasWidth: number;
  canvasHeight: number;
} => {
  const size = useWindowSize();
  const canvasWidth = size[0] - 300;
  const canvasHeight = (size[0] - 300) / 2;

  return { canvasWidth, canvasHeight };
};
