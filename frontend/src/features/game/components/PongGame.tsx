import { memo, FC } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../utils/gameConfig';

type Props = {
  draw: (ctx: CanvasRenderingContext2D) => void;
};

export const PongGame: FC<Props> = memo((props) => {
  const { draw } = props;
  const canvasRef = useCanvas(draw);

  return <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} />;
});
