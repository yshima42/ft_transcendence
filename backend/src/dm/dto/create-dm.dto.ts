import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDmRoomDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}

export class CreateDmDto {
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsUUID()
  dmRoomId!: string;
}

export class CreateDmChatUserDto {
  @IsNotEmpty()
  @IsUUID()
  dmRoomId!: string;

  @IsNotEmpty()
  @IsUUID()
  userId!: string;
}
