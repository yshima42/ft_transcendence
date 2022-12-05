import { BadRequestException, Injectable } from '@nestjs/common';
import { MatchResult } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchResultDto } from './dto/match-result.dto';
import {
  GameStats,
  MatchResultWithPlayers,
} from './interfaces/game-stats.interface';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async addMatchResult(
    playerOneId: string,
    matchResultDto: MatchResultDto
  ): Promise<MatchResult> {
    if (playerOneId !== matchResultDto.playerOneId) {
      throw new BadRequestException("Can't add match result of others");
    }

    const userScore = Number(matchResultDto.userScore);
    const opponentScore = Number(matchResultDto.opponentScore);
    if (
      !(userScore >= 0 && userScore <= 5) ||
      !(opponentScore >= 0 && opponentScore <= 5) ||
      (userScore < 5 && opponentScore < 5) ||
      (userScore === 5 && opponentScore === 5)
    ) {
      throw new BadRequestException('Invalid score');
    }

    const matchResult = await this.prisma.matchResult.create({
      data: {
        playerOneId: matchResultDto.playerOneId,
        playerTwoId: matchResultDto.playerTwoId,
        userScore,
        opponentScore,
        win: userScore > opponentScore,
      },
    });

    return matchResult;
  }

  async findMatchHistory(
    playerOneId: string
  ): Promise<MatchResultWithPlayers[]> {
    const matchResults = await this.prisma.matchResult.findMany({
      where: { playerOneId },
      include: {
        playerOne: true,
        playerTwo: true,
      },
    });

    return matchResults;
  }

  async findStats(playerOneId: string): Promise<GameStats> {
    const matchResults = await this.prisma.matchResult.findMany({
      where: { playerOneId },
    });
    const totalMatches = matchResults.length;
    const totalWins = matchResults.filter((match) => match.win).length;
    const winRate =
      totalMatches === 0 ? 0 : Math.round((totalWins / totalMatches) * 100);

    return {
      totalMatches,
      totalWins,
      totalLoses: totalMatches - totalWins,
      winRate,
    };
  }
}
