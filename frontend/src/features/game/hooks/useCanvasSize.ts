import { useLayoutEffect, useMemo } from 'react';

export const useCanvasSize = (): number[] => {
  const size = useMemo(() => [0, 0], []);
  useLayoutEffect(() => {
    const updateSize = (): void => {
      size[0] = window.innerWidth - 300;
      size[1] = window.innerHeight - 300;
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};
