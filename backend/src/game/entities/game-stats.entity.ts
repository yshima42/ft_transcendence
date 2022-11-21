import { ApiProperty } from '@nestjs/swagger';
import { GameStats } from '../interfaces/game-stats.interface';

export class GameStatsEntity implements GameStats {
  @ApiProperty({ default: true })
  winNum!: number;

  @ApiProperty({ default: false })
  loseNum!: number;
}
