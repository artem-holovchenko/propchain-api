import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { EmailTokenDto } from './dto/email-token.dto';
import { EmailService } from '../common/email.service';

@ApiTags('email')
@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService) { }

    @Get('/verification/:token')
    @Redirect(process.env.SIGN_IN_URL)
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    confirmEmail(@Param() emailTokenDto: EmailTokenDto): Promise<void> {
        return this.emailService.confirmEmail(emailTokenDto);
    }
}
