import * as ClassValidator from 'class-validator';

export class CreateChatMessageDto {
  @ClassValidator.IsNotEmpty()
  @ClassValidator.IsString()
  @ClassValidator.Length(1, 255)
  content!: string;
}
