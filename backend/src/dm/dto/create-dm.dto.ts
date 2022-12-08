import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDmDto {
  @IsNotEmpty()
  @IsString()
  content!: string;
}
