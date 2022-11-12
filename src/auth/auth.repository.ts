import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { User } from "../users/user.entity";
import * as bcrypt from 'bcrypt';
import { Role } from "./role.enum";
import { IUser } from "src/users/interfaces/user.interface";
import { EmailService } from "src/common/email.service";
import { JwtUserEmailPayload } from "src/email/interfaces/jwt-user-email-payload.interface";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthRepository {

    constructor(
        @Inject('USERS_REPOSITORY')
        private usersDBRepositoryAuth: typeof User,
        private emailServiceAuth: EmailService,
        private jwtService: JwtService,
    ) { }

    async createUser(user: IUser): Promise<IUser> {
        const gen_salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, gen_salt);
        try {
            const nUser = await this.usersDBRepositoryAuth.create({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                phone: user.phone,
                email: user.email,
                password: hashedPassword,
                salt: gen_salt,
                emailIsVerified: user.emailIsVerified,
                isUsaCitizen: user.isUsaCitizen,
                role: Role.User,
            });

            await this.emailServiceAuth.sendEmailConfirm(nUser);

            const { email } = nUser;
            const payload: JwtUserEmailPayload = { email };
            const accessToken: string = await this.jwtService.sign(payload);

            const rUser = {
                id: nUser.id,
                firstName: nUser.firstName,
                lastName: nUser.lastName,
                username: nUser.username,
                phone: nUser.phone,
                email: nUser.email,
                role: nUser.role,
                emailToken: accessToken,
            }

            return rUser;

        } catch (error) {
            throw new ConflictException(error.message);
        }
    }
}