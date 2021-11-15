import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class AuthService {
    constructor(
        private authRepository: AuthRepository,
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
    ) { }

    async signUp(user: IUser): Promise<IUser> {
        return this.authRepository.createUser(user);
    }

    async signIn(user: IUser): Promise<{ accessToken: string }> {
        const gUser = await this.usersRepository.getUserByEmail(user);
        const { email } = user;
        if (gUser && (await bcrypt.compare(user.password, gUser.password))) {
            if (gUser.emailIsVerified == true) {
                const payload: JwtPayload = { email };
                const accessToken: string = await this.jwtService.sign(payload);
                return { accessToken };
            } else {
                throw new UnauthorizedException('Please confirm your email');
            }
        }
        else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }
}


