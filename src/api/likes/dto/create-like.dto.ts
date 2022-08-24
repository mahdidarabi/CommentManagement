import { IsNumber, IsString } from 'class-validator';

export class CreateLikeDTO {
  @IsNumber()
  refId: number;

  @IsString()
  refType: 'post' | 'comment';

  @IsNumber()
  userId: number;
}
