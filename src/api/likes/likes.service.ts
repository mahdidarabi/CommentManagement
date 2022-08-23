import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLikeDTO } from './dto/create-like.dto';
import { Like } from './entities/like.entity';
import { ILike } from './interfaces/like.interface';

@Injectable()
export class LikesService {
  @InjectRepository(Like)
  private readonly repository: Repository<Like>;

  public async getLike(id: number): Promise<ILike> {
    const like = await this.repository.findOne({
      where: { id },
    });

    if (!like) throw new NotFoundException();

    const resLike: ILike = this.generateSendLikeObject(like);

    return resLike;
  }

  public async getLikes(query: any): Promise<ILike[]> {
    const likes = await this.repository.find({
      where: query,
    });

    if (!likes) throw new NotFoundException();

    const resLikes: ILike[] = [];

    likes.forEach((like) => {
      const resLike: ILike = this.generateSendLikeObject(like);

      resLikes.push(resLike);
    });

    return resLikes;
  }

  public async createLike(body: CreateLikeDTO): Promise<ILike> {
    const like = await this.repository.save(body);

    if (!like) throw new InternalServerErrorException();

    const resLike: ILike = this.generateSendLikeObject(like);

    return resLike;
  }

  public async softRemoveLike(id: number): Promise<void> {
    const execute = await this.repository.softRemove({ id });

    if (!execute) {
      throw new InternalServerErrorException();
    }
    if (!execute.deletedAt) {
      throw new NotFoundException();
    }
  }

  public async removeLike(id: number): Promise<void> {
    const execute = await this.repository.delete({ id });

    if (!execute) {
      throw new InternalServerErrorException();
    }
    if (execute.affected < 1) {
      throw new NotFoundException();
    }
  }

  private generateSendLikeObject(like: Like): ILike {
    return {
      ...like,
    };
  }

  public async getLikesCount(refId: number): Promise<number> {
    const execute = await this.repository.count({
      where: {
        refId,
      },
    });

    if (execute !== 0 && !execute) {
      throw new InternalServerErrorException();
    }

    return execute;
  }

  public async checkLikedByUser(
    refId: number,
    userId: number,
  ): Promise<boolean> {
    const like = await this.repository.findOne({
      where: { refId, userId },
    });

    if (!like) return false;
    return true;
  }
}
