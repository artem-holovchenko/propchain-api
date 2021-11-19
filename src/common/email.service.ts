import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/interfaces/user.interface';
import { UsersRepository } from 'src/users/users.repository';
import { IEmailToken } from '../email/interfaces/email-token.interface';
import { JwtUserIdPayload } from '../email/interfaces/jwt-user-id-payload.interface';
const mailgun = require("mailgun-js");

@Injectable()
export class EmailService {


    private mg;

    constructor(
        private emailUsersRepository: UsersRepository,
        private jwtService: JwtService,
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
            console.log(this.mg);
        } catch (e) {
            throw new InternalServerErrorException()
        }
    }

    async sendEmailConfirm(user: IUser): Promise<void> {
        const token = await this.generateEmailToken(user);
        const href = `${process.env.LOCALHOST_URL}/email/verification/${token.accessToken}`;
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
        const token = await this.generateEmailToken(user);
        const href = `${process.env.LOCALHOST_URL}/users/confirmPasswordChange/${token.accessToken}`;
        const data = {
            from: `Propchain <${process.env.MG_EMAIL}>`,
            to: user.email,
            subject: "Password reset",
            template: "password-reset",
            'v:href': href,
        };

        await this.sendMessages(data);
    }

    async generateEmailToken(user: IUser): Promise<{ accessToken: string }> {
        const gUser = await this.emailUsersRepository.getUserById(user);
        const { id } = user;
        if (gUser) {
            const payload: JwtUserIdPayload = { id };
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };
        }
    }

    async confirmEmail(emailToken: IEmailToken): Promise<void> {
        const gId = await this.jwtService.decode(emailToken.token) as IUser;
        const gUser = await this.emailUsersRepository.getUserById(gId);
        if (gUser) {
            await this.emailUsersRepository.updateEmail(gUser);
        }
    }
}
