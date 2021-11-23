import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IEmailToken } from "src/email/interfaces/email-token.interface";
import { JwtUserIdPayload } from "src/email/interfaces/jwt-user-email-payload.interface";
import { IUser } from "src/users/interfaces/user.interface";
import { UsersRepository } from "src/users/users.repository";


@Injectable()
export class EmailTokenService {
    constructor(
        private emailUsersRepository: UsersRepository,
        private jwtService: JwtService,
    ) { }

    async generateEmailToken(user: IUser): Promise<{ accessToken: string }> {
        const { email } = user;
        const payload: JwtUserIdPayload = { email };
        const accessToken: string = await this.jwtService.sign(payload);
        return { accessToken };
    }

    async confirmEmail(emailToken: IEmailToken): Promise<void> {
        const email = await this.jwtService.decode(emailToken.token) as IUser;
        await this.emailUsersRepository.updateEmail(email);
    }

}