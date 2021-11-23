import { Body, Controller, Get, Param, Patch, Post, Redirect, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetUserDto } from './dto/get-user.dto';
import { UserEmailToken } from './dto/userEmailToken.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserIdDto } from './dto/userId.dto';
import { IUser } from './interfaces/user.interface';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import express, {Request, Response} from 'express';
import { FilesService } from '../common/files.service';
import { IUserIdentity } from './interfaces/user-identity.interface';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService, private filesService: FilesService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.User)
    @Post('/uploadAvatar')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    @UseInterceptors(FileInterceptor('avatar', { dest: 'src/assets/images' }))
    uploadAvatar(@UploadedFile() file: Express.Multer.File, @Body() UserIdDto: UserIdDto, @Res({ passthrough: true }) res: Response): Promise<void> {
        return this.filesService.uploadAvatar(UserIdDto, file, res);
    }

    @Post('/confirmPasswordChange/:token')
    @Redirect(process.env.SIGN_IN_URL)
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    resetPassword(@Param() emailTokenDto: UserEmailToken, @Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
        const { password } = resetPasswordDto;
        return this.usersService.resetPassword(emailTokenDto, password);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Get('/WaitingVerification')
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
}