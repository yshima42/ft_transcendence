import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DummyLoginDto {
  @IsString()
  @ApiProperty({
    default: 'dummy1',
  })
  name!: string;
}
