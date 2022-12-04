import { Module } from '@nestjs/common';
// eslint-disable-next-line import/extensions
import { PongGateway } from './pong.gateway';

@Module({
  providers: [PongGateway],
})
export class PongModule {}
