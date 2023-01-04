import { useLayoutEffect, useMemo } from 'react';
import { BACKEND_CANVAS_WIDTH } from '../utils/gameConfig';

export const useCanvasSize = (): {
  width: number;
  height: number;
  ratio: number;
} => {
  const canvasSize = useMemo(() => {
    return {
      width: 0,
      height: 0,
      ratio: 0,
    };
  }, []);
  useLayoutEffect(() => {
    const updateSize = (): void => {
      canvasSize.width = window.innerWidth - 300;
      canvasSize.height = window.innerHeight - 300;
      canvasSize.ratio = (window.innerWidth - 300) / BACKEND_CANVAS_WIDTH;
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return canvasSize;
};
