import { useRef, useEffect } from 'react';
import {
  BACKEND_CANVAS_HEIGHT,
  BACKEND_CANVAS_WIDTH,
} from '../utils/gameConfig';

export const useCanvas = (
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void,
  canvasSize: { width: number; height: number; ratio: number }
): React.RefObject<HTMLCanvasElement> => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    let frameCount = 0;
    let animationFrameId = 0;

    // Our draw came here
    const render = () => {
      canvas.width = canvasSize.width;
      canvas.height =
        canvasSize.width * (BACKEND_CANVAS_HEIGHT / BACKEND_CANVAS_WIDTH);
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [draw]);

  return canvasRef;
};
