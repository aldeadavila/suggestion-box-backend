import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create.role.dto';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles-guard';
import { JwtRole } from 'src/auth/jwt/jwt-role';

@Controller('roles')
export class RolesController {

    constructor(private rolesService:RolesService) {}

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post()
    create(@Body() rol: CreateRoleDto) {
        return this.rolesService.create(rol);
    }
}
