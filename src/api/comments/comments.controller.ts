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
  Req,
  UseGuards,
} from '@nestjs/common';
import { IRequest } from 'src/interfaces/request.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { FindCommentsDTO } from './dto/find-comments.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { IComment } from './interfaces/comment.interface';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  @Inject(CommentsService)
  private readonly commentService: CommentsService;

  @Get(':id')
  public getComment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IRequest,
  ): Promise<IComment> {
    return this.commentService.getComment(id, req.user.userId);
  }

  @Get()
  public getComments(
    @Req() req: IRequest,
    @Query() query: FindCommentsDTO,
  ): Promise<IComment[]> {
    return this.commentService.getComments(query, req.user.userId);
  }

  @Post()
  public createComment(@Body() body: CreateCommentDTO): Promise<IComment> {
    return this.commentService.createComment(body);
  }

  @Put(':id')
  public updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCommentDTO,
    @Req() req: IRequest,
  ): Promise<IComment> {
    return this.commentService.updateComment(id, body, req.user.userId);
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
