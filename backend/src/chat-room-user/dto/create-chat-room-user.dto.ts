import * as CV from 'class-validator';

export class CreateChatRoomMemberDto {
  @CV.IsOptional()
  @CV.IsString()
  chatRoomPassword?: string;
}
