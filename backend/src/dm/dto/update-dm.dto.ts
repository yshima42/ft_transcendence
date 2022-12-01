import { PartialType } from '@nestjs/swagger';
import { CreateDmRoomDto } from './create-dm.dto';

export class UpdateDmDto extends PartialType(CreateDmRoomDto) {}
