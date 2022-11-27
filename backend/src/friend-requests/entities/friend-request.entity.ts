import { ApiProperty } from '@nestjs/swagger';
import { FriendRequest, FriendRequestStatus } from '@prisma/client';

export class FriendRequestEntity implements FriendRequest {
  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ default: '21514d8b-e6af-490c-bc51-d0c7a359a267' })
  creatorId!: string;

  @ApiProperty({ default: '40e8b4b4-9b39-4b7e-8e31-78e31975d320' })
  receiverId!: string;

  @ApiProperty({ default: 'PENDING' })
  status!: FriendRequestStatus;
}
