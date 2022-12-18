import { ApiProperty } from '@nestjs/swagger';
import { FriendRelation } from '../interfaces/friend-relation.interface';

export class FriendRelationEntity {
  @ApiProperty({ default: 'ACCEPTED' })
  friendRelation!: FriendRelation;
}
