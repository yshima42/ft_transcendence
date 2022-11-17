import { IsNumberString, IsUUID } from 'class-validator';

export class MatchResultDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  opponentId!: string;

  @IsNumberString()
  userScore!: string;

  @IsNumberString()
  opponentScore!: string;
}
