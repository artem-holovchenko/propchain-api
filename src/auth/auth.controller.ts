import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { IUser } from './interfaces/user.interface';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    @ApiCreatedResponse({ description: 'User has been successfully created.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error.' })
    signUp(@Body() authSignupDto: AuthSignupDto): Promise<IUser> {
        return this.authService.signUp(authSignupDto);
    }

}
