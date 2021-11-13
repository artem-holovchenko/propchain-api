import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreatedUserDto } from 'src/auth/dto/createdUser.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { EmailTokenDto } from './dto/email-token.dto';
import { EmailService } from './email.service';

@ApiTags('email')
@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService) { }

    @Get('/verification/:token')
    @Redirect('http://localhost:3000/auth/signin')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    confirmEmail(@Param() emailTokenDto: EmailTokenDto): Promise<void> {
        return this.emailService.confirmEmail(emailTokenDto);
    }
}
