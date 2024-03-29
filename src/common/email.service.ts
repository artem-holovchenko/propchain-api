import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IEmailToken } from 'src/email/interfaces/email-token.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { EmailTokenService } from './email-token.service';
const mailgun = require("mailgun-js");
const mailchimp = require("@mailchimp/mailchimp_marketing");

@Injectable()
export class EmailService {


    private mg;

    constructor(
        private emailTokenService: EmailTokenService,
        private jwtService: JwtService,
    ) {
        this.mg = mailgun({ apiKey: process.env.MG_API, domain: process.env.MG_DOMAIN, });
        mailchimp.setConfig({ apiKey: process.env.MC_API, server: process.env.MC_SERVER_PREFIX });
    }

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
        const href = `${process.env.HEROKU_URL}/email/verification/${token.emailToken}`;
        const data = {
            from: `Propchain <${process.env.MG_EMAIL}>`,
            to: user.email,
            subject: "Email confirmation",
            template: "email-confirmation",
            'v:href': href,
        };

        await this.sendMessages(data);
    }

    async resendConfirm(emailToken: IEmailToken): Promise<void> {
        const email = await this.jwtService.decode(emailToken.emailToken) as IUser;
        await this.sendEmailConfirm(email);
    }

    async resendPasswordChange(emailToken: IEmailToken): Promise<void> {
        const email = await this.jwtService.decode(emailToken.emailToken) as IUser;
        await this.sendResetPassword(email);
    }

    async sendResetPassword(user: IUser): Promise<any> {
        const token = await this.emailTokenService.generateEmailToken(user);
        const href = `${process.env.CREATE_PASS_URL}/${token.emailToken}`;
        const data = {
            from: `Propchain <${process.env.MG_EMAIL}>`,
            to: user.email,
            subject: "Password reset",
            template: "password-reset",
            'v:href': href,
        };

        await this.sendMessages(data);

        return token;
    }

    async subscribeUser(user: IUser): Promise<void> {
        try {
            await mailchimp.lists.getListMember(process.env.MC_LIST_ID, user.email);
        } catch (e) {
            try {
                if (e.status === 404) {
                    await mailchimp.lists.addListMember(process.env.MC_LIST_ID, { email_address: user.email, status: "pending" });
                }
            } catch (e) {
                throw new InternalServerErrorException();
            }
        }
    }
}
