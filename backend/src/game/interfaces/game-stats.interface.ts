import { Prisma } from '@prisma/client';

export interface GameStats {
  totalMatches: number;
  totalWins: number;
  totalLoses: number;
  winRate: number;
}

export type MatchResultWithPlayers = Prisma.MatchResultGetPayload<{
  include: {
    playerOne: true;
    playerTwo: true;
  };
}>;
