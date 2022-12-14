import { ApiProperty } from '@nestjs/swagger';
import { MatchResult } from '@prisma/client';

export class MatchResultEntity implements MatchResult {
  @ApiProperty({ default: '61514d8b-e6af-490c-bc51-d0c7a359a267' })
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ default: '21514d8b-e6af-490c-bc51-d0c7a359a267' })
  playerOneId!: string;

  @ApiProperty({ default: '40e8b4b4-9b39-4b7e-8e31-78e31975d320' })
  playerTwoId!: string;

  @ApiProperty({ default: 5 })
  playerOneScore!: number;

  @ApiProperty({ default: 3 })
  playerTwoScore!: number;

  @ApiProperty()
  finishedAt!: Date;
}
