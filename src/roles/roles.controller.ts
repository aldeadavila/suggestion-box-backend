import { Body, Controller, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create.role.dto';

@Controller('roles')
export class RolesController {

    constructor(private rolesService:RolesService) {}

    @Post()
    create(@Body() rol: CreateRoleDto) {
        return this.rolesService.create(rol);
    }
}
