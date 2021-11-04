import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { IUser } from './interfaces/user.interface';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    signUp(@Body() authSignupDto: AuthSignupDto): Promise<IUser> {
        return this.authService.signUp(authSignupDto);
    }

}
