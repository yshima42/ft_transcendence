import { BadRequestException, Injectable } from '@nestjs/common';
import { MatchResult } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMatchResultDto } from './dto/create-match-result.dto';
import {
  GameStats,
  MatchResultWithPlayers,
} from './interfaces/game-stats.interface';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async addMatchResult(
    createMatchResultDto: CreateMatchResultDto
  ): Promise<MatchResult> {
    const playerOneScore = createMatchResultDto.playerOneScore;
    const playerTwoScore = createMatchResultDto.playerTwoScore;
    if (
      !(playerOneScore >= 0 && playerOneScore <= 5) ||
      !(playerTwoScore >= 0 && playerTwoScore <= 5) ||
      (playerOneScore < 5 && playerTwoScore < 5) ||
      (playerOneScore === 5 && playerTwoScore === 5)
    ) {
      throw new BadRequestException('Invalid score');
    }
    const playerOneId = createMatchResultDto.playerOneId;
    const playerTwoId = createMatchResultDto.playerTwoId;
    if (playerOneId === playerTwoId) {
      throw new BadRequestException('Do not play with yourself');
    }

    const matchResult = await this.prisma.matchResult.create({
      data: {
        playerOneId,
        playerTwoId,
        playerOneScore,
        playerTwoScore,
      },
    });

    return matchResult;
  }

  async findMatchHistory(playerId: string): Promise<MatchResultWithPlayers[]> {
    const matchResults = await this.prisma.matchResult.findMany({
      where: {
        OR: [{ playerOneId: playerId }, { playerTwoId: playerId }],
      },
      include: {
        playerOne: true,
        playerTwo: true,
      },
      orderBy: {
        finishedAt: 'desc',
      },
    });

    return matchResults;
  }

  async findStats(playerId: string): Promise<GameStats> {
    const matchResults = await this.prisma.matchResult.findMany({
      where: {
        OR: [{ playerOneId: playerId }, { playerTwoId: playerId }],
      },
    });
    const totalMatches = matchResults.length;

    const winMatches = matchResults.filter((match) => {
      return (
        (match.playerOneId === playerId && match.playerOneScore === 5) ||
        (match.playerTwoId === playerId && match.playerTwoScore === 5)
      );
    });

    const totalWins = winMatches.length;

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
