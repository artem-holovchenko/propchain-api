import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "src/users/interfaces/user.interface";
import { UsersRepository } from "src/users/users.repository";
import { IEmailToken } from "./interfaces/email-token.interface";
import { JwtUserIdPayload } from "./interfaces/jwt-user-id-payload.interface";

@Injectable()
export class EmailRepository {

    constructor(
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
    ) { }

    async sendEmail(user: IUser): Promise<void> {
        const token = await this.generateEmailToken(user);
        const mailgun = require("mailgun-js");
        const mg = mailgun({ apiKey: process.env.MG_API, domain: process.env.MG_DOMAIN });
        const href = `${process.env.LOCALHOST_URL}/email/verification/${token.accessToken}`;
        const data = {
            from: `Propchain <${process.env.MG_EMAIL}>`,
            to: user.email,
            subject: "Email confirmation",
            template: "email-confirmation",
            'v:href': href,
        };
        await mg.messages().send(data, function (error, body) {
            console.log(body);
        });

    }

    async generateEmailToken(user: IUser): Promise<{ accessToken: string }> {
        const gUser = await this.usersRepository.getUserById(user);
        const { id } = user;
        if (gUser) {
            const payload: JwtUserIdPayload = { id };
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };
        }
    }

    async confirmEmail(emailToken: IEmailToken): Promise<void> {
        const gId = await this.jwtService.decode(emailToken.token) as IUser;
        const gUser = await this.usersRepository.getUserById(gId);
        if (gUser) {
            await this.usersRepository.updateEmail(gUser);
        }
    }
}