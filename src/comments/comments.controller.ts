import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles-guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {

    constructor(private commentService: CommentsService) {}

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('suggestion/:id_suggestion') // http://localhost:3000/comments/:id_suggestion
    findBySuggestion(@Param('id_suggestion', ParseIntPipe) id_suggestion: number ) {
        return this.commentService.findBySuggestion(id_suggestion)     
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('user/:id_user') // http://localhost:3000/comments/:id_user
    findByUser(@Param('id_user', ParseIntPipe) id_user: number ) {
        return this.commentService.findByUser(id_user)     
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post() //http://localhost:3000/comments
    create(@Body() comment: CreateCommentDto) {
        console.log('CreateCommentDto: ', comment);
        return this.commentService.create(comment);
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put(':id') //http://localhost:3000/comments/:id
    updateComment(
        @Param('id', ParseIntPipe) id: number, 
        @Body() comment: UpdateCommentDto ) {
        return this.commentService.update(id, comment);
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Delete(':id')
    delete(
        @Param('id', ParseIntPipe) id: number
    ) {
        console.log("Id a borrar:", id)
        return this.commentService.delete(id)
    }

}
