import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MatchResult, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MatchResultDto } from './dto/match-result.dto';
import { GameService } from './game.service';

@Controller('game')
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
}
