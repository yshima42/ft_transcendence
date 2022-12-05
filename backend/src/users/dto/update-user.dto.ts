import { ApiProperty } from '@nestjs/swagger';
import { OnlineStatus } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    default:
      'http://localhost:3000/users/21514d8b-e6af-490c-bc51-d0c7a359a267/profile/avatar/dummy1.png',
  })
  avatarImageUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    default: 'patrash',
  })
  nickname?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    default: false,
  })
  isTwoFactorAuthEnabled?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    default: '',
  })
  twoFactorAuthSecret?: string;

  @IsEnum(OnlineStatus)
  @IsOptional()
  @ApiProperty({
    default: 'ONLINE',
  })
  onlineStatus?: OnlineStatus;
}
