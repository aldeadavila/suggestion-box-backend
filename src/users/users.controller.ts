import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles-guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}


    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get() //http://localhost/users
    findAll() {
        return this.userService.findAll();
    }

    @Post() //http://localhost/users
    createUser(@Body() user: CreateUserDto) {
        return this.userService.create(user);
    }


    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put(':id') //http://localhost:3000/users/:id
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto ) {
        return this.userService.update(id, user);
    }


    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('file'))
    uploadWithImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                  new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
                  new FileTypeValidator({ fileType: '(png|jpeg|jpg)' }),
                ],
              }),
        ) file: Express.Multer.File,
        @Param('id', ParseIntPipe) id: number, 
        @Body() user: UpdateUserDto
        ) {
        console.log(file);
        return this.userService.updateWithImage(file, id, user)
    }


    
}
