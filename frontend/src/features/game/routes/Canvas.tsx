import { memo, FC } from 'react';
import { useCanvas } from '../hooks/useCanvas';

type Props = {
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
};

export const Canvas: FC<Props> = memo((props) => {
  const { draw } = props;
  const canvasRef = useCanvas(draw);

  return <canvas width={1000} height={500} ref={canvasRef} />;
});
