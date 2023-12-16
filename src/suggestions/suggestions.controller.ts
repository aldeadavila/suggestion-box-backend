import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles-guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';


@Controller('suggestions')
export class SuggestionsController {

    constructor(private prductsService: SuggestionsService) {}

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get() // http://localhost:3000/suggestions
    findAll(    
        ) {
        return this.prductsService.findAll()
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('category/:id_category') // http://localhost:3000/suggestions/:id_category
    findByCategoryl(@Param('id_category', ParseIntPipe) id_category: number ) {
        return this.prductsService.findByCategory(id_category)
        
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post() // http://localhost:3000/suggestions
    @UseInterceptors(FilesInterceptor('files[]', 2))
    create(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                  new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
                  new FileTypeValidator({ fileType: '(png|jpeg|jpg)' }),
                ],
              }),
        ) files: Array<Express.Multer.File>,

        @Body() suggestion: CreateSuggestionDto
        ) {
        return this.prductsService.create(files, suggestion)
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('upload/:id') // http://localhost:3000/suggestions
    @UseInterceptors(FilesInterceptor('files[]', 2))
    updateWithImage(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                  new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
                  new FileTypeValidator({ fileType: '(png|jpeg|jpg)' }),
                ],
              }),
        ) files: Array<Express.Multer.File>,
        @Param('id', ParseIntPipe) id: number,      
        @Body() suggestion: UpdateSuggestionDto
        ) {
            console.log('Update with image Data: ', suggestion);
        return this.prductsService.updateWithImages(files, id, suggestion)
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put(':id') // http://localhost:3000/suggestions
    update(    
        @Param('id', ParseIntPipe) id: number,      
        @Body() suggestion: UpdateSuggestionDto
        ) {
        return this.prductsService.update(id, suggestion)
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Delete(':id') // http://localhost:3000/suggestions
    delete(    
        @Param('id', ParseIntPipe) id: number,      
        ) {
        return this.prductsService.delete(id)
    }
}
