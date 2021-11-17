import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { Role } from '../auth/role.enum';
import { UsersRepository } from './users.repository';
import { IUserIdToken } from './interfaces/userId-token.dto';

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository
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
        return this.usersRepository.confirmResetPassword(user);
    }

    async resetPassword(userIdToken: IUserIdToken, password: string): Promise<void> {
        return this.usersRepository.resetPassword(userIdToken, password);
    }

    async uploadAvatar(user:IUser, file:Express.Multer.File):Promise<void> {
        return this.usersRepository.uploadAvatar(user, file);
    }
}
