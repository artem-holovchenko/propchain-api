import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {

    constructor(private usersRepository: UsersRepository) { }

    async signUp(i_user: IUser): Promise<IUser> {
        return this.usersRepository.createUser(i_user);
    }
}


