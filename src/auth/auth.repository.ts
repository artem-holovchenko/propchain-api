import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { User } from "../users/user.entity";
import * as bcrypt from 'bcrypt';
import { Role } from "./role.enum";
import { IUser } from "src/users/interfaces/user.interface";
import { EmailService } from "src/common/email.service";

@Injectable()
export class AuthRepository {

    constructor(
        @Inject('USERS_REPOSITORY')
        private usersDBRepositoryAuth: typeof User,
        private emailServiceAuth: EmailService,
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

            const rUser = {
                username: nUser.username,
                email: nUser.email,
                role: nUser.role,
            }

            return rUser;

        } catch (error) {
            throw new ConflictException(error.message);
        }
    }
}