import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { Role } from '../auth/role.enum';
import { UsersRepository } from './users.repository';
import { IUserIdToken } from './interfaces/userId-token.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
        private usersEmailService: EmailService,
    ) { }

    async getUserByEmail(user: IUser): Promise<IUser> {
        return this.usersRepository.getUserByEmail(user);
    }

    async getUserById(user: IUser): Promise<IUser> {
        return this.usersRepository.getUserById(user);
    }

    async updateRole(user: IUser, role: Role): Promise<IUser> {
        return this.usersRepository.updateRole(user, role);
    }

    async confirmResetPassword(user: IUser): Promise<void> {
        const fUser = await this.getUserByEmail(user);
        if (fUser) await this.usersEmailService.sendResetPassword(fUser);
    }

    async resetPassword(userIdToken: IUserIdToken, password: string): Promise<void> {
        return this.usersRepository.resetPassword(userIdToken, password);
    }

}
