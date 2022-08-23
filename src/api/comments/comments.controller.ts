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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { FindCommentsDTO } from './dto/find-comments.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { IComment } from './interfaces/comment.interface';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  @Inject(CommentsService)
  private readonly commentService: CommentsService;

  @Get(':id')
  public getComment(@Param('id', ParseIntPipe) id: number): Promise<IComment> {
    return this.commentService.getComment(id);
  }

  @Get()
  public getComments(@Query() query: FindCommentsDTO): Promise<IComment[]> {
    return this.commentService.getComments(query);
  }

  @Post()
  public createComment(@Body() body: CreateCommentDTO): Promise<IComment> {
    return this.commentService.createComment(body);
  }

  @Put(':id')
  public updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCommentDTO,
  ): Promise<IComment> {
    return this.commentService.updateComment(id, body);
  }

  @Delete(':id/purge')
  @HttpCode(204)
  public removeComment(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.commentService.removeComment(id);
  }

  @Delete(':id')
  @HttpCode(204)
  public softRemoveComment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.commentService.softRemoveComment(id);
  }
}
