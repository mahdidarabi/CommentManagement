import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [AuthModule, CommentsModule, LikesModule],
})
export class ApiModule {}
