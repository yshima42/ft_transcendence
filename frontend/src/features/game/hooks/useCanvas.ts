import { useRef, useEffect } from 'react';

export const useCanvas = (
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void
): React.RefObject<HTMLCanvasElement> => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    let frameCount = 0;
    let animationFrameId = 0;

    // Our draw came here
    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [draw]);

  return canvasRef;
};
