import { ApiProperty, PartialType } from '@nestjs/swagger';
import { FriendRequestStatus } from '@prisma/client';
import { IsString, IsUUID } from 'class-validator';
import { CreateFriendRequestDto } from './create-friend-request.dto';

export class UpdateFriendRequestDto extends PartialType(
  CreateFriendRequestDto
) {
  @IsString()
  @IsUUID()
  @ApiProperty({ default: '40e8b4b4-9b39-4b7e-8e31-78e31975d320' })
  creatorId!: string;

  @IsString()
  @IsUUID()
  @ApiProperty({ default: '40e8b4b4-9b39-4b7e-8e31-78e31975d320' })
  receiverId!: string;

  @ApiProperty({ default: 'Pending' })
  status!: FriendRequestStatus;
}
