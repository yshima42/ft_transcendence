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
      const padding = 300;
      canvasSize.width = window.innerWidth - padding;
      canvasSize.height = window.innerHeight - padding;
      canvasSize.ratio = (window.innerWidth - padding) / BACKEND_CANVAS_WIDTH;
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return canvasSize;
};
