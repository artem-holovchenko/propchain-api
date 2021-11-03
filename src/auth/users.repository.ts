import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { AuthSingupDto } from "./dto/auth-singup.dto";

@Injectable()
export class UsersRepository {

    constructor(
        @Inject('USERS_REPOSITORY')
        private usersRepository: typeof User
    ) { }

    async createUser(authSingupDto: AuthSingupDto): Promise<void> {
        const { first_name, last_name, username, phone, email, password } = authSingupDto;
        const gen_salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, gen_salt);

        try {
            const user = await this.usersRepository.create({
                first_name,
                last_name,
                username,
                phone,
                email,
                password: hashedPassword,
                salt: gen_salt,
            });
        } catch (error) {
            throw new ConflictException(error.message);
        }

    }

}