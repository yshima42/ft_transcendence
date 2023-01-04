import { useLayoutEffect, useMemo } from 'react';

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
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return canvasSize;
};
