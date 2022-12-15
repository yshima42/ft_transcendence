import * as CV from 'class-validator';

export class CreateChatRoomUserDto {
  @CV.IsOptional()
  @CV.IsString()
  chatRoomPassword?: string;
}
