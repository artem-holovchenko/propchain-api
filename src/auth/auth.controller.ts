import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreatedUserDto } from 'src/auth/dto/createdUser.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';

@ApiTags('auth')
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

}
