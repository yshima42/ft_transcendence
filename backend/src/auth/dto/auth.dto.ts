import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  constructor() {
    this.name = '';
  }

  @IsString()
  @IsNotEmpty()
  name: string;
}
