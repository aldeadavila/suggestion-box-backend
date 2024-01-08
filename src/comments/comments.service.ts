import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto'
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity'
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {

    constructor(@InjectRepository(Comment) private commentsRepository: Repository<Comment>) {}

    findBySuggestion(id_suggestion: number) {
        return this.commentsRepository.findBy({id_suggestion: id_suggestion})
    }

    findByUser(id_user: number) {
        return this.commentsRepository.findBy({id_user: id_user})
    }

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

    async delete(id: number) {
        const commentFound = await this.commentsRepository.findOneBy({id: id});
        if(!commentFound) {
            throw new HttpException("Comentario no encontrada", HttpStatus.NOT_FOUND);
        }
        return this.commentsRepository.delete(id);
    }
}
