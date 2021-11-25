import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/role.enum';
import { User } from './user.entity';

@Injectable()
export class AdminService implements OnModuleInit {
    constructor(
        @Inject('USERS_REPOSITORY')
        private usersDBRepositoryAuth: typeof User,
    ) { }

    async onModuleInit(): Promise<void> {
        const gUser = await this.usersDBRepositoryAuth.findOne({ where: { email: "admin@gmail.com" } });
        if (!gUser) {
            const gen_salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash('AdminPassw1!', gen_salt);
            await this.usersDBRepositoryAuth.create({
                username: "Admin",
                email: "admin@gmail.com",
                password: hashedPassword,
                salt: gen_salt,
                emailIsVerified: true,
                role: Role.Admin,
            });
        }

    }
}
