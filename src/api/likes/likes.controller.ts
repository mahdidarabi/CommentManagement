import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LikesService } from './likes.service';
import { CreateLikeDTO } from './dto/create-like.dto';
import { FindLikesDTO } from './dto/find-likes.dto';
import { ILike } from './interfaces/like.interface';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  @Inject(LikesService)
  private readonly likeService: LikesService;

  @Get(':id')
  public getLike(@Param('id', ParseIntPipe) id: number): Promise<ILike> {
    return this.likeService.getLike(id);
  }

  @Get()
  public getLikes(@Query() query: FindLikesDTO): Promise<ILike[]> {
    return this.likeService.getLikes(query);
  }

  @Post()
  public createLike(@Body() body: CreateLikeDTO): Promise<ILike> {
    return this.likeService.createLike(body);
  }

  @Delete(':id/purge')
  @HttpCode(204)
  public removeLike(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.likeService.removeLike(id);
  }

  @Delete(':id')
  @HttpCode(204)
  public softRemoveLike(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.likeService.softRemoveLike(id);
  }
}
