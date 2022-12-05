import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDmDto {
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsUUID()
  dmRoomId!: string;
}
