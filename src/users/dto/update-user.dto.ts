import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {

    
    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastname?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    phone?: string;

    image?: string;
    notification_token?: string;
}