import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  constructor() {
    this.name = '';
  }

  @IsString()
  @IsNotEmpty()
  name: string;
}
