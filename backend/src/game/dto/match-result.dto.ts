import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsUUID, Max, Min } from 'class-validator';

// あとでcreateMatchResultDtoにしたい
export class MatchResultDto {
  @IsUUID()
  @ApiProperty({ default: '21514d8b-e6af-490c-bc51-d0c7a359a267' })
  playerOneId!: string;

  @IsUUID()
  @ApiProperty({ default: '40e8b4b4-9b39-4b7e-8e31-78e31975d320' })
  playerTwoId!: string;

  @Transform((transformFnParams) => Number(transformFnParams.value))
  @IsNumber()
  @Max(5)
  @Min(0)
  @ApiProperty({ default: 5 })
  playerOneScore!: number;

  @Transform((transformFnParams) => Number(transformFnParams.value))
  @IsNumber()
  @Max(5)
  @Min(0)
  @ApiProperty({ default: 5 })
  playerTwoScore!: number;
}
