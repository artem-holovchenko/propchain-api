import { Injectable } from '@nestjs/common';
import { EmailRepository } from './email.repository';
import { IEmailToken } from './interfaces/email-token.interface';

@Injectable()
export class EmailService {
    constructor(
        private emailRepository: EmailRepository
    ) { }

    async confirmEmail(emailToken: IEmailToken): Promise<void> {
        return this.emailRepository.confirmEmail(emailToken);
    }


}