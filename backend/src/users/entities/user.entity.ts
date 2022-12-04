import { ApiProperty } from '@nestjs/swagger';
import { OnlineStatus, User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({
    default: '21514d8b-e6af-490c-bc51-d0c7a359a267',
  })
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ default: 'dummy1' })
  name!: string;

  @ApiProperty({
    default:
      'http://localhost:3000/users/21514d8b-e6af-490c-bc51-d0c7a359a267/profile/avatar/dummy1.png',
  })
  avatarImageUrl!: string;

  @ApiProperty({
    default: 'patrash',
  })
  nickname!: string;

  @ApiProperty({
    default: '',
  })
  twoFactorAuthSecret!: string;

  @ApiProperty({
    default: false,
  })
  isTwoFactorAuthEnabled!: boolean;

  @ApiProperty({ default: 'ONLINE' })
  onlineStatus!: OnlineStatus;
}
