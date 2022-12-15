import { memo, FC } from 'react';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../utils/gameConfig';
import { Canvas } from './Canvas';

type Props = {
  draw: (ctx: CanvasRenderingContext2D) => void;
};

export const PongGame: FC<Props> = memo((props) => {
  const { draw } = props;

  return <Canvas draw={draw} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />;
});
