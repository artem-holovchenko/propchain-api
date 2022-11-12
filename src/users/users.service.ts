import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { Role } from '../auth/role.enum';
import { UsersRepository } from './users.repository';
import { IPasswordReset } from './interfaces/userEmail.interface';
import { IUserIdentity } from 'src/identities/interfaces/user-identity.interface';

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

    async getWaitingUsers(): Promise<IUserIdentity[]> {
        return this.usersRepository.getWaitingUsers();
    }

    async updateRole(user: IUser, role: Role): Promise<IUser> {
        return this.usersRepository.updateRole(user, role);
    }

    async confirmResetPassword(passwordReset: IPasswordReset): Promise<void> {
        return this.usersRepository.confirmResetPassword(passwordReset);
    }

    async deleteUserByEmail(user:IUser): Promise<void> {
        return this.usersRepository.deleteUserByEmail(user);
    }

    async getAllUsers(): Promise<IUser[]> {
        return this.usersRepository.getAllUsers();
    }

    async setAvatar(user: IUser, file: Express.Multer.File): Promise<string> {
        return this.usersRepository.setAvatar(user, file);
    }

    async editUser(userId: IUser, user: IUser): Promise<IUser> {
        return this.usersRepository.editUser(userId, user);
    }

    async deleteAvatar(userId: IUser): Promise<void> {
        return this.usersRepository.deleteAvatar(userId);
    }
}
