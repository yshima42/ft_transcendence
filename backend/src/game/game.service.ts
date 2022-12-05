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

  // TODO 自分で自分と戦う場合の処理
  async addMatchResult(
    createMatchResultDto: CreateMatchResultDto
  ): Promise<MatchResult> {
    const playerOneScore = Number(createMatchResultDto.playerOneScore);
    const playerTwoScore = Number(createMatchResultDto.playerTwoScore);
    if (
      (playerOneScore < 5 && playerTwoScore < 5) ||
      (playerOneScore === 5 && playerTwoScore === 5)
    ) {
      throw new BadRequestException('Invalid score');
    }

    const matchResult = await this.prisma.matchResult.create({
      data: {
        playerOneId: createMatchResultDto.playerOneId,
        playerTwoId: createMatchResultDto.playerTwoId,
        playerOneScore,
        playerTwoScore,
        win: playerOneScore > playerTwoScore,
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
        (match.playerOneId === playerId && match.win) ||
        (match.playerTwoId === playerId && !match.win)
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
