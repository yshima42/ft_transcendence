import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UpdateRelationshipDto {
  @IsString()
  @IsUUID()
  @ApiProperty({ default: '40e8b4b4-9b39-4b7e-8e31-78e31975d320' })
  peerId!: string;
}
