import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatroomDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
