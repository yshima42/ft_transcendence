import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

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
      'http://sample.com/users/21514d8b-e6af-490c-bc51-d0c7a359a267/profile/avatar/dummy1.png',
  })
  avatarImageUrl!: string;

  @ApiProperty({
    default: 'patrash',
  })
  nickname!: string;
}
