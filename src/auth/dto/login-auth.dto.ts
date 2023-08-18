import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginAuthDto {

    @IsNotEmpty()
    @IsString()
    @IsEmail({}, {message: 'El email no es válido'})
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message: 'La contraseña debe tener mínimo 6 caracteres'})
    password: string;
}