import { MatchResult, User } from '@prisma/client';
import { useCustomGetApi } from '../generics/useGetApi';

// export type MatchResultWithPlayers = Prisma.MatchResultGetPayload<{
//   include: {
//     playerOne: true;
//     playerTwo: true;
//   };
// }>;

// バックエンドと型を共有したい
// MatchResultWithPlayersを作る時2つ手間があった
// 1、バックエンドの戻り値がprisma generateで生成される型じゃない場合、フロントとバック両方に書く必要がある
// 2、1をする時、prismaのmodelから生成された型のバリエーションを作ろうとすると面倒。
// 現状の方法ではフロントとバックエンドでschema.prismaのプロパティ名が違うため。
// とりあえず対処療法、相談する
// https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/operating-against-partial-structures-of-model-types
export type MatchResultWithPlayers = MatchResult & {
  playerOne: User;
  playerTwo: User;
};

export const useMatchHistory = (
  userId = 'me'
): { matchHistory: MatchResultWithPlayers[] } => {
  const endpoint =
    userId === 'me' ? '/game/matches' : `/users/${userId}/game/matches`;
  const { data: matchHistory } =
    useCustomGetApi<MatchResultWithPlayers[]>(endpoint);

  return { matchHistory };
};
