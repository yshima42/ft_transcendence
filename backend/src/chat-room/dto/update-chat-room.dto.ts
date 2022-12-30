import { PickType, PartialType } from '@nestjs/mapped-types';
import { CreateChatRoomDto } from './create-chat-room.dto';

export class UpdateChatRoomDto extends PartialType(
  PickType(CreateChatRoomDto, ['password', 'roomStatus'] as const)
) {}
