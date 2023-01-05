import { useRef, useEffect } from 'react';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../utils/gameConfig';

export const useCanvas = (canvas: {
  width: number;
  height: number;
  ratio: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
}): React.RefObject<HTMLCanvasElement> => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const currentCanvas = canvasRef.current as HTMLCanvasElement;
    const context = currentCanvas.getContext('2d') as CanvasRenderingContext2D;

    let animationFrameId = 0;

    // Our draw came here
    const render = () => {
      currentCanvas.width = canvas.width;
      currentCanvas.height = canvas.width * (CANVAS_HEIGHT / CANVAS_WIDTH);
      canvas.draw(context);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [canvas]);

  return canvasRef;
};
