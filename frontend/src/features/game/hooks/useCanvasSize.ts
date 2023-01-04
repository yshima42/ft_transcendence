import { useLayoutEffect, useMemo } from 'react';
import { CANVAS_WIDTH } from '../utils/gameConfig';

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
      const minimumWidth = 300;

      // window.innerWidthに合わせてcanvasのサイズを変更する
      // ただし、最小値はminimumWidth
      // window.innerHeightに合わせてcanvasのサイズ変更は未実装
      if (window.innerWidth > padding + minimumWidth) {
        canvasSize.width = window.innerWidth - padding;
      } else {
        canvasSize.width = minimumWidth;
      }
      canvasSize.height = canvasSize.width - padding;
      canvasSize.ratio = canvasSize.width / CANVAS_WIDTH;
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return canvasSize;
};
