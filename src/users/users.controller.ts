import { Body, Controller, Delete, Get, Param, Patch, Post, Redirect, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import express, {Request, Response} from 'express';
import { FilesService } from '../common/files.service';
import { UserEmailDto } from 'src/email/dto/user-email.dto';
import { RejectFilesDto } from './dto/reject-files.dto';

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

    //@UseGuards(AuthGuard('jwt'), RolesGuard)
    //@Roles(Role.User)
    @Post('/VerifyFiles')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    @UseInterceptors(FilesInterceptor('files', 2, { dest: 'src/assets/images' }))
    verifyFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() userIdDto: UserIdDto, @Res({ passthrough: true }) res: Response): Promise<void> {
        return this.filesService.uploadFiles(userIdDto, files, res);
    }

    //@UseGuards(AuthGuard('jwt'), RolesGuard)
    //@Roles(Role.Admin)
    @Post('/ApproveFiles')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    approveFiles(@Body() userIdDto: UserIdDto): Promise<void> {
        return this.usersService.approveFiles(userIdDto);
    }

    //@UseGuards(AuthGuard('jwt'), RolesGuard)
    //@Roles(Role.Admin)
    @Post('/RejectFiles')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    rejectFiles(@Body() rejectFilesDto: RejectFilesDto): Promise<void> {
        return this.usersService.rejectFiles(rejectFilesDto);
    }

    @Post('/confirmPasswordChange/:token')
    @Redirect(process.env.SIGN_IN_URL)
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    resetPassword(@Param() emailTokenDto: UserEmailToken, @Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
        const { password } = resetPasswordDto;
        return this.usersService.resetPassword(emailTokenDto, password);
    }

    @Delete('/:email/delete')
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