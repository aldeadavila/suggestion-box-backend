import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare} from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService
    ){}

    async register(user:RegisterAuthDto) {

        const { email, phone } = user;

        const emailExists = await this.usersRepository.findOneBy({email: email});

        if (emailExists) {
            return new HttpException('El email ya está registrado', HttpStatus.CONFLICT)
        }

        const phoneExists = await this.usersRepository.findOneBy({phone: phone});

        if (phoneExists) {
            return new HttpException('El teléfono ya está registrado', HttpStatus.CONFLICT)
        }

        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    async login(loginData: LoginAuthDto) {
        const { email, password} = loginData
        const userFound = await this.usersRepository.findOneBy({email: email});

        if (!userFound) {
            return new HttpException('El email no está registrado', HttpStatus.NOT_FOUND)
        }

        const isPasswordValid = await compare(password, userFound.password);

        if (!isPasswordValid) {
            return new HttpException('El password es incorrecto', HttpStatus.FORBIDDEN)
        }

        const payload = {id: userFound.id, name: userFound.name};
        const token = this.jwtService.sign(payload);
        const data = {
            user: userFound,
            token: token
        }

        return data;
    }
}
