import { PartialType } from '@nestjs/swagger';
import { CreateChatMessageDto } from './create-chat.dto';

export class UpdateChatRoomDto extends PartialType(CreateChatMessageDto) {}
