export class CreateUserDto {

    name: string;
    lastname: string;
    nickname: string;
    email: string;
    phone: string;
    password: string;
    image?: string;
    notification_token?: string;

}