import { BadRequestException, Injectable } from '@nestjs/common';
import { MatchResult } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchResultDto } from './dto/match-result.dto';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async addMatchResult(
    userId: string,
    matchResultDto: MatchResultDto
  ): Promise<MatchResult> {
    if (userId !== matchResultDto.userId) {
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
        userId: matchResultDto.userId,
        opponentId: matchResultDto.opponentId,
        userScore,
        opponentScore,
        win: userScore > opponentScore,
      },
    });

    return matchResult;
  }

  async findMatchHistory(userId: string): Promise<MatchResult[]> {
    const matchResults = await this.prisma.matchResult.findMany({
      where: { userId },
    });

    return matchResults;
  }
}
