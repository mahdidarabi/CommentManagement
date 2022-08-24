import { IsNumber, IsString, Length } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  @Length(1, 120)
  content: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  postId: number;
}
