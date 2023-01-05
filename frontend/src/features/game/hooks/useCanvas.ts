import { useRef, useEffect } from 'react';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../utils/gameConfig';

export const useCanvas = (
  draw: (ctx: CanvasRenderingContext2D) => void,
  canvasSize: { width: number; height: number; ratio: number }
): React.RefObject<HTMLCanvasElement> => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    let animationFrameId = 0;

    // Our draw came here
    const render = () => {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.width * (CANVAS_HEIGHT / CANVAS_WIDTH);
      draw(context);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [draw, canvasSize.width]);

  return canvasRef;
};
