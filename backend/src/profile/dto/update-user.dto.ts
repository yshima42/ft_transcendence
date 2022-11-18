import { OnlineStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsEnum(OnlineStatus)
  @IsOptional()
  onlineStatus?: OnlineStatus;
}
