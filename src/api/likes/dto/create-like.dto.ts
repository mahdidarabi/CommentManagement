export class CreateLikeDTO {
  refId: number;
  refType: 'post' | 'comment';
  userId: number;
}
