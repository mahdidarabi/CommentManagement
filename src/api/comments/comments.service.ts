import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { IComment } from './interfaces/comment.interface';

@Injectable()
export class CommentsService {
  @InjectRepository(Comment)
  private readonly repository: Repository<Comment>;

  public async getComment(id: number): Promise<IComment> {
    const comment = await this.repository.findOne({
      where: { id },
    });

    if (!comment) throw new NotFoundException();

    const likesCount = this.getLikesCount(comment.id);
    const likedByUser = this.checkLikedByUser(comment.id, comment.userId);

    const resComment: IComment = this.generateSendCommentObject(
      comment,
      likesCount,
      likedByUser,
    );

    return resComment;
  }

  public async getComments(query: any): Promise<IComment[]> {
    const comments = await this.repository.find({
      where: query,
    });

    if (!comments) throw new NotFoundException();

    const resComments: IComment[] = [];

    comments.forEach((comment) => {
      const likesCount = this.getLikesCount(comment.id);
      const likedByUser = this.checkLikedByUser(comment.id, comment.userId);

      const resComment: IComment = this.generateSendCommentObject(
        comment,
        likesCount,
        likedByUser,
      );

      resComments.push(resComment);
    });

    return resComments;
  }

  public async createComment(body: CreateCommentDTO): Promise<IComment> {
    const comment = await this.repository.save(body);

    if (!comment) throw new InternalServerErrorException();

    const likesCount = this.getLikesCount(comment.id);
    const likedByUser = this.checkLikedByUser(comment.id, comment.userId);

    const resComment: IComment = this.generateSendCommentObject(
      comment,
      likesCount,
      likedByUser,
    );

    return resComment;
  }

  public async updateComment(
    id: number,
    body: UpdateCommentDTO,
  ): Promise<IComment> {
    const execute = await this.repository.update(id, body);

    if (!execute) {
      throw new InternalServerErrorException();
    }
    if (execute.affected < 1) {
      throw new NotFoundException();
    }

    const comment = await this.repository.findOne({
      where: { id },
    });

    const likesCount = this.getLikesCount(comment.id);
    const likedByUser = this.checkLikedByUser(comment.id, comment.userId);

    const resComment: IComment = this.generateSendCommentObject(
      comment,
      likesCount,
      likedByUser,
    );

    return resComment;
  }

  public async softRemoveComment(id: number): Promise<void> {
    const execute = await this.repository.softRemove({ id });

    if (!execute) {
      throw new InternalServerErrorException();
    }
    if (!execute.deletedAt) {
      throw new NotFoundException();
    }
  }

  public async removeComment(id: number): Promise<void> {
    const execute = await this.repository.delete({ id });

    if (!execute) {
      throw new InternalServerErrorException();
    }
    if (execute.affected < 1) {
      throw new NotFoundException();
    }
  }

  private generateSendCommentObject(
    comment: Comment,
    likesCount: number,
    likedByUser: boolean,
  ): IComment {
    return {
      id: String(comment.id),
      senderId: String(comment.userId),
      content: comment.content,
      postedAt: comment.createdAt,
      likesCount,
      likedByUser,
    };
  }

  private getLikesCount(refId: number): number {
    return null;
  }

  private checkLikedByUser(refId: number, userId: number): boolean {
    return null;
  }
}
