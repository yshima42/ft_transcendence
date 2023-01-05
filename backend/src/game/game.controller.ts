import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { GameStatsEntity } from './entities/game-stats.entity';
import { MatchResultEntity } from './entities/match-result.entity';
import { GameService } from './game.service';
import {
  GameStats,
  MatchResultWithPlayers,
} from './interfaces/game-stats.interface';

@Controller('game')
@ApiTags('game')
@UseGuards(JwtOtpAuthGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('matches')
  @ApiOperation({ summary: 'ゲーム結果を取得' })
  @ApiOkResponse({ type: MatchResultEntity, isArray: true })
  async findMatchHistory(
    @GetUser() user: User
  ): Promise<MatchResultWithPlayers[]> {
    return await this.gameService.findMatchHistory(user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'ゲームStatsを取得' })
  @ApiOkResponse({ type: GameStatsEntity })
  async findGameStats(@GetUser() user: User): Promise<GameStats> {
    return await this.gameService.findStats(user.id);
  }
}
