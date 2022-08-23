export interface ILike {
  id: number;
  userId: number;
  refId: number;
  refType: 'post' | 'comment';
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
