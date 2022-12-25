import { ApiProperty } from '@nestjs/swagger';

export class BlockRelationEntity {
  @ApiProperty({ default: true })
  isUserBlocked!: boolean;
}
