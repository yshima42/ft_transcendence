import { PartialType } from '@nestjs/swagger';
import { CreateChatRoomDto } from './create-chat.dto';

export class UpdateChatRoomDto extends PartialType(CreateChatRoomDto) {}
