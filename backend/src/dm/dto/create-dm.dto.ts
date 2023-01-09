import * as CV from 'class-validator';
export class CreateDmDto {
  @CV.IsNotEmpty()
  @CV.IsUUID()
  roomId!: string;

  @CV.IsNotEmpty()
  @CV.IsString()
  @CV.Length(1, 255)
  content!: string;
}
