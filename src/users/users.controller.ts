import { Body, Controller, Get, Param, Patch, Redirect, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetUserDto } from './dto/get-user.dto';
import { UserIdToken } from './dto/userIdToken.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserIdDto } from './dto/userId.dto';
import { IUser } from './interfaces/user.interface';
import { UsersService } from './users.service';
import { EmailService } from 'src/email/email.service';
import { UserEmailDto } from './dto/user-email.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

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

    @Get('/resetPassword')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    confirmResetPassword(@Body() userEmailDto: UserEmailDto): Promise<void> {
        return this.usersService.confirmResetPassword(userEmailDto);
    }

    @Get('/setPassword/:token')
    @Redirect(process.env.SIGN_IN_URL)
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    resetPassword(@Param() idTokenDto: UserIdToken, @Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
        const { password } = resetPasswordDto;
        return this.usersService.resetPassword(idTokenDto, password);
    }
}

    // @Patch('/:id/password')
    // @ApiOkResponse({ type: GetUserDto })
    // @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    // async resetPassword(@Param() userIdDto: UserIdDto, @Body() resetPasswordDto: ResetPasswordDto): Promise<IUser> {
    //     const { password } = resetPasswordDto;
    //     return this.usersService.resetPassword(userIdDto, password);
    // }
