import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { Role } from '../auth/role.enum';
import { UsersRepository } from './users.repository';
import { IUserEmailToken } from './interfaces/userEmail.interface';

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
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

    async resetPassword(userEmailToken: IUserEmailToken, password: string): Promise<void> {
        return this.usersRepository.resetPassword(userEmailToken, password);
    }

}
