import { ApiProperty } from '@nestjs/swagger';
import { RelationshipType } from '@prisma/client';
import { IsString, IsUUID } from 'class-validator';

export class CreateRelationshipDto {
  @IsString()
  @IsUUID()
  @ApiProperty({ default: '40e8b4b4-9b39-4b7e-8e31-78e31975d320' })
  userId!: string;

  @IsString()
  @IsUUID()
  @ApiProperty({ default: '40e8b4b4-9b39-4b7e-8e31-78e31975d320' })
  peerId!: string;

  @ApiProperty({ default: '40e8b4b4-9b39-4b7e-8e31-78e31975d320' })
  type!: RelationshipType;

  @ApiProperty({ default: true })
  isBlocking!: boolean;
}
