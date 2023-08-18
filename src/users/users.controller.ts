import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}


    @UseGuards(JwtAuthGuard)
    @Get() //http://localhost/users
    findAll() {
        return this.userService.findAll();
    }

    @Post() //http://localhost/users
    createUser(@Body() user: CreateUserDto) {
        return this.userService.create(user);
    }


    @UseGuards(JwtAuthGuard)
    @Put(':id') //http://localhost:3000/users/:id
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto ) {
        return this.userService.update(id, user);
    }

    
}
