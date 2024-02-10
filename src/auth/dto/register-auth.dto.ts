import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterAuthDto {

    @IsNotEmpty()
    @IsString()
    nickname: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail({}, {message: 'El email no es válido'})
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message: 'La contraseña debe tener mínimo 6 caracteres'})
    password: string;

    rolesIds: string[];

}