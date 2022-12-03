import { ApiProperty } from '@nestjs/swagger';
import { GameStats } from '../interfaces/game-stats.interface';

export class GameStatsEntity implements GameStats {
  @ApiProperty({ default: 10 })
  totalMatches!: number;

  @ApiProperty({ default: 10 })
  totalWins!: number;

  @ApiProperty({ default: 5 })
  totalLoses!: number;

  @ApiProperty({ default: 66.6 })
  winRate!: number;
}
