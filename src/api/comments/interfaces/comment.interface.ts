export interface IComment {
  id: string; // comment id
  senderId: string;
  content: string;
  postedAt: Date;
  likesCount: number;
  likedByUser: boolean;
}
