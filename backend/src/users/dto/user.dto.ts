import { ApiProperty } from '@nestjs/swagger';
import { OnlineStatus } from '@prisma/client';
import { IsDate, IsEnum, IsString, IsUUID, Length } from 'class-validator';

export class UserDto {
  @IsUUID()
  @ApiProperty({ default: '21514d8b-e6af-490c-bc51-d0c7a359a267' })
  id?: string;

  @IsDate()
  createdAt?: Date;

  @IsDate()
  updatedAt?: Date;

  @IsString()
  @Length(1, 50)
  @ApiProperty({ default: 'dummy1' })
  name?: string;

  @IsString()
  @ApiProperty({
    default:
      'http://localhost:3000/users/21514d8b-e6af-490c-bc51-d0c7a359a267/profile/avatar/dummy1.png',
  })
  avatarImageUrl?: string;

  @IsString()
  @ApiProperty({
    default: 'patrash',
  })
  nickname?: string;

  @IsEnum(OnlineStatus)
  @ApiProperty({
    default: 'ONLINE',
  })
  onlineStatus?: OnlineStatus;
}
