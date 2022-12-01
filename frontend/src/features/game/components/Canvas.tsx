import { memo, FC } from 'react';
import { useCanvas } from '../hooks/useCanvas';

type Props = {
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
  width: number;
  height: number;
};

export const Canvas: FC<Props> = memo((props) => {
  const { draw, width, height } = props;
  const canvasRef = useCanvas(draw);

  return <canvas width={width} height={height} ref={canvasRef} />;
});
