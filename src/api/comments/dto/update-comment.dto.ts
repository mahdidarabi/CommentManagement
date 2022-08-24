import { IsString, Length } from 'class-validator';

export class UpdateCommentDTO {
  @IsString()
  @Length(1, 120)
  content: string;
}
