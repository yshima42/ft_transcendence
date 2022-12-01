import * as CV from 'class-validator';

export class CreateDmRoomDto {
  @CV.IsNotEmpty()
  @CV.IsString()
  name!: string;
}

export class CreateDmMessageDto {
  @CV.IsNotEmpty()
  @CV.IsString()
  content!: string;

  @CV.IsNotEmpty()
  @CV.IsUUID()
  dmRoomId!: string;

  @CV.IsNotEmpty()
  @CV.IsUUID()
  senderId!: string;

  constructor(content: string, dmRoomId: string, senderId: string) {
    console.log('CreateDmMessageDto: ', content, dmRoomId, senderId);
    console.log('CreateDmMessageDto constructor');
  }
}

export class CreateDmChatUserDto {
  @CV.IsNotEmpty()
  @CV.IsUUID()
  dmRoomId!: string;

  @CV.IsNotEmpty()
  @CV.IsUUID()
  userId!: string;
}
