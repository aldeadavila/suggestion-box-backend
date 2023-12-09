import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto'
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity'
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {

    constructor(@InjectRepository(Comment) private commentsRepository: Repository<Comment>) {}

    async create(comment: CreateCommentDto) {

        const newComment = this.commentsRepository.create(comment);
        return this.commentsRepository.save(newComment);
    }


    
    async update(id: number, comment: UpdateCommentDto) {

        const commentFound = await this.commentsRepository.findOneBy({ id: id});

        if (!commentFound) {
            throw new HttpException("Comentario no encontrado", HttpStatus.NOT_FOUND)
        }

        const updatedComment = Object.assign(commentFound, comment);
        return this.commentsRepository.save(updatedComment)
    }
}
