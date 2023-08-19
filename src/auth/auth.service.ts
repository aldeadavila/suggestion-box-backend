import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { In, Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare} from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Rol) private rolesRepository: Repository<Rol>,
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
        const rolesIds = user.rolesIds;
        const roles = await this.rolesRepository.findBy({id: In(rolesIds)})
        newUser.roles = roles;
        const userSaved = await this.usersRepository.save(newUser);
        const rolesString= userSaved.roles.map(rol => rol.id) // ['CLIENT', 'ADMIN']

        const payload = {
            id: userSaved.id, 
            name: userSaved.name,
            roles: rolesString
        };
        const token = this.jwtService.sign(payload);
        const data = {
            user: userSaved,
            token: 'Bearer ' + token
        }

        delete data.user.password

        return data;
    }

    async login(loginData: LoginAuthDto) {
        const { email, password} = loginData
        const userFound = await this.usersRepository.findOne({
            where: {email: email},
            relations: ['roles']
        });

        if (!userFound) {
            return new HttpException('El email no está registrado', HttpStatus.NOT_FOUND)
        }

        const isPasswordValid = await compare(password, userFound.password);

        if (!isPasswordValid) {
            return new HttpException('El password es incorrecto', HttpStatus.FORBIDDEN)
        }

        const rolesIds = userFound.roles.map(rol => rol.id) // ['CLIENT', 'ADMIN']

        const payload = {
            id: userFound.id, 
            name: userFound.name, 
            roles: rolesIds
        };
        const token = this.jwtService.sign(payload);
        const data = {
            user: userFound,
            token: 'Bearer ' + token
        }

        delete data.user.password

        return data;
    }
}
