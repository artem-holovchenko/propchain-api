import { Body, Controller, Delete, Get, Param, Patch, Post, Redirect, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetUserDto } from './dto/get-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserIdDto } from './dto/userId.dto';
import { IUser } from './interfaces/user.interface';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserEmailDto } from 'src/email/dto/user-email.dto';
import { IUserIdentity } from 'src/identities/interfaces/user-identity.interface';
import { EditUserDto } from './dto/edit-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.User)
    @Post('/uploadAvatar')
    @ApiCreatedResponse({description: 'Avatar successfully uploaded'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    @UseInterceptors(FileInterceptor('avatar', { dest: 'src/assets/images' }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
                id: { type: 'string' },
            },
        },
    })
    uploadAvatar(@UploadedFile() file: Express.Multer.File, @Body() UserIdDto: UserIdDto): Promise<void> {
        return this.usersService.setAvatar(UserIdDto, file);
    }

    @Post('/confirmPasswordChange/')
    @ApiCreatedResponse({description: 'Password successfully changed'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    confirmResetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
        return this.usersService.confirmResetPassword(resetPasswordDto);
    }

    @Delete('/:email/delete')
    @ApiOkResponse({description: 'User successfully deleted'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    deleteUserByEmail(@Param() userEmailDto: UserEmailDto): Promise<void> {
        return this.usersService.deleteUserByEmail(userEmailDto);
    }

    @Get()
    @ApiOkResponse({ type: GetUserDto })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    getAllUsers(): Promise<IUser[]> {
        return this.usersService.getAllUsers();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Get('/waitingVerification')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    getWaitingUsers(): Promise<IUserIdentity[]> {
        return this.usersService.getWaitingUsers();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Get('/:id')
    @ApiOkResponse({ type: GetUserDto })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    getUserById(@Param() userIdDto: UserIdDto): Promise<IUser> {
        return this.usersService.getUserById(userIdDto);
    }

    @Patch('/:id/role')
    @ApiOkResponse({ type: GetUserDto })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    async updateRole(@Param() userIdDto: UserIdDto, @Body() updateRoleDto: UpdateRoleDto): Promise<IUser> {
        const { role } = updateRoleDto;
        return this.usersService.updateRole(userIdDto, role);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.User)
    @Patch('/:id/editUser')
    @ApiOkResponse({ type: GetUserDto })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    editUser(@Param() id: UserIdDto, @Body() editUserDto: EditUserDto): Promise<IUser> {
        return this.usersService.editUser(id, editUserDto);
    }
}