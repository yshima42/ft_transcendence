import { IsNotEmpty, IsString } from 'class-validator';

export class CredentialsDto {
  constructor() {
    this.name = '';
  }

  @IsString()
  @IsNotEmpty()
  name: string;
}
