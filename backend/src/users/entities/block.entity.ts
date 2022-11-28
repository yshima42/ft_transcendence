import { ApiProperty } from '@nestjs/swagger';
import { Block } from '@prisma/client';

export class BlockEntity implements Block {
  @ApiProperty({
    default: '21514d8b-e6af-490c-bc51-d0c7a359a267',
  })
  sourceId!: string;

  @ApiProperty({
    default: '40e8b4b4-9b39-4b7e-8e31-78e31975d320',
  })
  targetId!: string;
}
