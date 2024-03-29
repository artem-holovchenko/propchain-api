import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { EmailTokenDto } from './dto/email-token.dto';
import { EmailTokenService } from 'src/common/email-token.service';
import { EmailService } from 'src/common/email.service';
import { UserEmailDto } from './dto/user-email.dto';

@ApiTags('email')
@Controller('email')
export class EmailController {
    constructor(private emailTokenService: EmailTokenService, private emailService: EmailService) { }

    @Get('/verification/:emailToken')
    @Redirect(process.env.SIGN_IN_URL)
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    confirmEmail(@Param() emailTokenDto: EmailTokenDto): Promise<void> {
        return this.emailTokenService.confirmEmail(emailTokenDto);
    }

    @Post('/resendConfirm')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    resendConfirm(@Body() emailTokenDto: EmailTokenDto): Promise<void> {
        return this.emailService.resendConfirm(emailTokenDto);
    }

    @Post('/resendPasswordChange')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    resendPasswordChange(@Body() emailTokenDto: EmailTokenDto): Promise<void> {
        return this.emailService.resendPasswordChange(emailTokenDto);
    }
    
    @Post('/requestPasswordChange')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    confirmResetPassword(@Body() userEmailDto: UserEmailDto): Promise<any> {
        return this.emailService.sendResetPassword(userEmailDto);
    }

    @Post('/subscribe')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    subscribeUser(@Body() userEmailDto: UserEmailDto): Promise<any> {
        return this.emailService.subscribeUser(userEmailDto);
    }
}
