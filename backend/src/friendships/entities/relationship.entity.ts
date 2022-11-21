import { ApiProperty } from '@nestjs/swagger';
import { Relationship, RelationshipType } from '@prisma/client';

export class RelationshipEntity implements Relationship {
  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ default: '21514d8b-e6af-490c-bc51-d0c7a359a267' })
  userId!: string;

  @ApiProperty({ default: '40e8b4b4-9b39-4b7e-8e31-78e31975d320' })
  peerId!: string;

  @ApiProperty({ default: 'FRIEND' })
  type!: RelationshipType;
}
