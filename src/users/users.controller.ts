import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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

    
}
