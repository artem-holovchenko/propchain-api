import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSingupDto } from './dto/auth-singup.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    signUp(@Body() authSingupDto: AuthSingupDto): Promise<void> {
        return this.authService.singUp(authSingupDto);
    }

}
