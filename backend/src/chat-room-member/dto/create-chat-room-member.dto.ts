import * as CV from 'class-validator';

export class CreateChatRoomMemberDto {
  @CV.IsOptional()
  @CV.IsString()
  @CV.Length(8, 128)
  chatRoomPassword?: string;
}
