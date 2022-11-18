import { OnlineStatus } from '@prisma/client';
import { IsDate, IsEnum, IsString, IsUUID } from 'class-validator';

export class UserDto {
  @IsUUID()
  id?: string;

  @IsDate()
  createdAt?: Date;

  @IsDate()
  updatedAt?: Date;

  @IsString()
  name?: string;

  @IsString()
  avatarUrl?: string;

  @IsString()
  nickname?: string;

  @IsEnum(OnlineStatus)
  onlineStatus?: OnlineStatus;
}
