import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { IUser } from "./interfaces/user.interface";

@Injectable()
export class UsersRepository {

    constructor(
        @Inject('USERS_REPOSITORY')
        private usersRepository: typeof User
    ) { }

    async createUser(i_user: IUser): Promise<IUser> {
        const gen_salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(i_user.password, gen_salt);
        try {
            const user = await this.usersRepository.create({
                first_name: i_user.first_name,
                last_name: i_user.last_name,
                username: i_user.username,
                phone: i_user.phone,
                email: i_user.email,
                password: hashedPassword,
                salt: gen_salt,
            });

            const rUser = {
                username: user.username,
                email: user.email
            }

            return rUser;

        } catch (error) {
            throw new ConflictException(error.message);
        }
    }
}