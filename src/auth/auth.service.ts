import { Injectable } from '@nestjs/common';
import { AuthSingupDto } from './dto/auth-singup.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {

    constructor(private usersRepository: UsersRepository) { }

    async singUp(authSingupDto: AuthSingupDto,): Promise<void> {
        return this.usersRepository.createUser(authSingupDto);
    }
}


