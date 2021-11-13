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
        const DOMAIN = "sandbox8aca5e346d8e47b5b41816c6fdfec1d5.mailgun.org";
        const mg = mailgun({ apiKey: "2a00cbf2d0336ace88a1f3a0ef0a472f-30b9cd6d-4b4086c3", domain: DOMAIN });
        const href = `http://localhost:3000/email/verification/${token.accessToken}`;
        const data = {
            from: "Propchain <postmaster@sandbox8aca5e346d8e47b5b41816c6fdfec1d5.mailgun.org>",
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