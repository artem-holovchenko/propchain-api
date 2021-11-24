import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUser } from 'src/users/interfaces/user.interface';
import { EmailTokenService } from './email-token.service';
const mailgun = require("mailgun-js");

@Injectable()
export class EmailService {


    private mg;

    constructor(
        private emailTokenService: EmailTokenService,
    ) { this.mg = mailgun({ apiKey: process.env.MG_API, domain: process.env.MG_DOMAIN }); }

    async sendMessages(mailData): Promise<void> {
        const send = function (mailData) {
            return new Promise((resolve, reject) => {
                this.mg.messages().send(mailData, (error, body) => {
                    if (error) reject(error)
                    else resolve(body);
                });
            })
        }
        try {
            const bsend = send.bind(this);
            const body = await bsend(mailData);
            console.log(body);
        } catch (e) {
            throw new InternalServerErrorException()
        }
    }

    async sendEmailConfirm(user: IUser): Promise<void> {
        const token = await this.emailTokenService.generateEmailToken(user);
        const href = `${process.env.HEROKU_URL}/email/verification/${token.accessToken}`;
        const data = {
            from: `Propchain <${process.env.MG_EMAIL}>`,
            to: user.email,
            subject: "Email confirmation",
            template: "email-confirmation",
            'v:href': href,
        };

        await this.sendMessages(data);
    }

    async sendResetPassword(user: IUser): Promise<void> {
        const token = await this.emailTokenService.generateEmailToken(user);
        const href = `${process.env.HEROKU_URL}/users/confirmPasswordChange/${token.accessToken}`;
        const data = {
            from: `Propchain <${process.env.MG_EMAIL}>`,
            to: user.email,
            subject: "Password reset",
            template: "password-reset",
            'v:href': href,
        };

        await this.sendMessages(data);
    }
}
