import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserIdDto } from './dto/userId.dto';
import { IUser } from './interfaces/user.interface';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Get('/:id')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    getUserById(@Param() userIdDto: UserIdDto): Promise<IUser> {
        return this.usersService.getUserById(userIdDto);
    }

    @Patch('/:id/role')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    async updateRole(@Param() userIdDto: UserIdDto, @Body() updateRoleDto: UpdateRoleDto): Promise<IUser> {
        const { role } = updateRoleDto;
        return this.usersService.updateRole(userIdDto, role);
    }

}
