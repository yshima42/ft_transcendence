import * as CV from 'class-validator';

export class CreateChatMessageDto {
  @CV.IsNotEmpty()
  @CV.IsUUID()
  chatRoomId!: string;

  @CV.IsNotEmpty()
  @CV.IsString()
  @CV.Length(1, 255)
  content!: string;
}
