import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Suggestion } from 'src/suggestions/suggestion.entity';
import { Comment } from 'src/comments/comment.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Suggestion, Comment, User])],
  controllers: [CommentsController],
  providers: [CommentsService, JwtStrategy]
})
export class CommentsModule {}
