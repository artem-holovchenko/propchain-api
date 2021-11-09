import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { CreatedUserDto } from './dto/createdUser.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserIdDto } from './dto/userId.dto';
import { IUser } from './interfaces/user.interface';
import { Role } from './role.enum';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    @ApiCreatedResponse({ type: CreatedUserDto })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    signUp(@Body() authSignupDto: AuthSignupDto): Promise<IUser> {
        return this.authService.signUp(authSignupDto);
    }

    @Post('/signin')
    @ApiOkResponse({ description: 'Login successful.' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    signIn(
        @Body() authLoginDto: AuthLoginDto,
    ): Promise<{ accessToken: string }> {
        return this.authService.signIn(authLoginDto);
    }

    @UseGuards(AuthGuard())
    @Get('/:id')
    @Roles(Role.User)
    getUserById(@Param() userIdDto: UserIdDto): Promise<IUser> {
        return this.authService.getUserById(userIdDto);
    }

    @UseGuards(AuthGuard())
    @Patch('/:id/role')
    async updateRole(@Param() userIdDto: UserIdDto, @Body() updateRoleDto: UpdateRoleDto): Promise<IUser> {
        const { role } = updateRoleDto;
        return this.authService.updateRole(userIdDto, role);
    }
}
