import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IEmailToken } from "src/email/interfaces/email-token.interface";
import { JwtUserEmailPayload } from "src/email/interfaces/jwt-user-email-payload.interface";
import { IUser } from "src/users/interfaces/user.interface";
import { UsersRepository } from "src/users/users.repository";


@Injectable()
export class EmailTokenService {
    constructor(
        private emailUsersRepository: UsersRepository,
        private jwtService: JwtService,
    ) { }

    async generateEmailToken(user: IUser): Promise<{ emailToken: string }> {
        const { email } = user;
        const payload: JwtUserEmailPayload = { email };
        const emailToken: string = await this.jwtService.sign(payload);
        return { emailToken };
    }

    async confirmEmail(emailToken: IEmailToken): Promise<void> {
        const email = await this.jwtService.decode(emailToken.emailToken) as IUser;
        await this.emailUsersRepository.updateEmail(email);
    }

}