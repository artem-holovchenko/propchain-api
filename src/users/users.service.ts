import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { Role } from '../auth/role.enum';
import { UsersRepository } from './users.repository';
import { IUserEmailToken } from './interfaces/userEmail.interface';
import { IUserIdentity } from './interfaces/user-identity.interface';
import { IRejectFiles } from '../identities/interfaces/reject-files.interface';

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

    async resetPassword(userEmailToken: IUserEmailToken, password: string): Promise<void> {
        return this.usersRepository.resetPassword(userEmailToken, password);
    }

    async deleteUserByEmail(user:IUser): Promise<void> {
        return this.usersRepository.deleteUserByEmail(user);
    }

    async getAllUsers(): Promise<IUser[]> {
        return this.usersRepository.getAllUsers();
    }

    async setAvatar(user: IUser, file: Express.Multer.File): Promise<void> {
        return this.usersRepository.setAvatar(user, file);
    }
}
