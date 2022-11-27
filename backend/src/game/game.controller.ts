import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MatchResult, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MatchResultDto } from './dto/match-result.dto';
import { GameStatsEntity } from './entities/game-stats.entity';
import { MatchResultEntity } from './entities/match-result.entity';
import { GameService } from './game.service';
import { GameStats } from './interfaces/game-stats.interface';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('matches')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'ゲーム結果を送信' })
  @ApiCreatedResponse({ type: MatchResultEntity })
  async addMatchResult(
    @GetUser() user: User,
    @Body() matchResultDto: MatchResultDto
  ): Promise<MatchResult> {
    return await this.gameService.addMatchResult(user.id, matchResultDto);
  }

  @Get('matches')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'ゲーム結果を取得' })
  @ApiOkResponse({ type: MatchResultEntity, isArray: true })
  async findMatchHistory(@GetUser() user: User): Promise<MatchResult[]> {
    return await this.gameService.findMatchHistory(user.id);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'ゲームStatsを取得' })
  @ApiOkResponse({ type: GameStatsEntity })
  async findGameStats(@GetUser() user: User): Promise<GameStats> {
    return await this.gameService.findStats(user.id);
  }
}
