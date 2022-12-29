import { useLayoutEffect, useMemo } from 'react';

export const useWindowSize = (): number[] => {
  const size = useMemo(() => [0, 0], []);
  useLayoutEffect(() => {
    const updateSize = (): void => {
      size[0] = window.innerWidth;
      size[1] = window.innerHeight;
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};
