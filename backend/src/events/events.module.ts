import { Module } from '@nestjs/common';
// eslint-disable-next-line import/extensions
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
})
export class EventsModule {}
