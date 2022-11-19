import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MatchResult, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MatchResultDto } from './dto/match-result.dto';
import { GameService } from './game.service';
import { GameStats } from './interfaces/game-stats.interface';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('matches')
  @UseGuards(JwtAuthGuard)
  async addMatchResult(
    @GetUser() user: User,
    @Body() matchResultDto: MatchResultDto
  ): Promise<MatchResult> {
    return await this.gameService.addMatchResult(user.id, matchResultDto);
  }

  @Get('matches')
  @UseGuards(JwtAuthGuard)
  async findMatchHistory(@GetUser() user: User): Promise<MatchResult[]> {
    return await this.gameService.findMatchHistory(user.id);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async findGameStats(@GetUser() user: User): Promise<GameStats> {
    return await this.gameService.findStats(user.id);
  }
}
