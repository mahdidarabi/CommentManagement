import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageDto } from 'src/dto/page.dto';
import { Repository } from 'typeorm';
import { LikesService } from '../likes/likes.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { IComment } from './interfaces/comment.interface';

@Injectable()
export class CommentsService {
  @InjectRepository(Comment)
  private readonly repository: Repository<Comment>;
  @Inject(LikesService)
  private readonly likesService: LikesService;

  public async getComment(id: number, reqUserId: number): Promise<IComment> {
    const comment = await this.repository.findOne({
      where: { id },
    });

    if (!comment) throw new NotFoundException();

    const likesCount = await this.getLikesCount(comment.id);
    const likedByUser = await this.checkLikedByUser(comment.id, reqUserId);

    const resComment: IComment = this.generateSendCommentObject(
      comment,
      likesCount,
      likedByUser,
    );

    return resComment;
  }

  public async getComments(
    pageOptionsDto: PageOptionsDto,
    reqUserId: number,
  ): Promise<PageDto<IComment>> {
    const queryBuilder = this.repository.createQueryBuilder('comment');

    queryBuilder
      .orderBy('comment.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    let resComments: IComment[] = [];

    resComments = await Promise.all(
      entities.map(async (comment) => {
        const likesCount = await this.getLikesCount(comment.id);
        const likedByUser = await this.checkLikedByUser(comment.id, reqUserId);

        const resComment: IComment = this.generateSendCommentObject(
          comment,
          likesCount,
          likedByUser,
        );

        return resComment;
      }),
    );

    return new PageDto(resComments, pageMetaDto);
  }

  public async createComment(body: CreateCommentDTO): Promise<IComment> {
    const comment = await this.repository.save(body);

    if (!comment) throw new InternalServerErrorException();

    const resComment: IComment = this.generateSendCommentObject(
      comment,
      0,
      false,
    );

    return resComment;
  }

  public async updateComment(
    id: number,
    body: UpdateCommentDTO,
    reqUserId: number,
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

    const likesCount = await this.getLikesCount(comment.id);
    const likedByUser = await this.checkLikedByUser(comment.id, reqUserId);

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

  private async getLikesCount(refId: number): Promise<number> {
    return await this.likesService.getLikesCount(refId);
  }

  private async checkLikedByUser(
    refId: number,
    reqUserId: number,
  ): Promise<boolean> {
    return await this.likesService.checkLikedByUser(refId, reqUserId);
  }
}
