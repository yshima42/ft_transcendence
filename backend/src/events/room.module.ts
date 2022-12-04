import { Module } from '@nestjs/common';
// eslint-disable-next-line import/extensions
import { RoomGateway } from './room.gateway';

@Module({
  providers: [RoomGateway],
})
export class RoomModule {}
