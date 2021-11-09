import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Role } from './role.enum';

@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
    ) { }

    async signUp(iUser: IUser): Promise<IUser> {
        return this.usersRepository.createUser(iUser);
    }

    async signIn(iUser: IUser): Promise<{ accessToken: string }> {
        const user = await this.usersRepository.getUserByEmail(iUser);
        const { email } = iUser;
        if (user && (await bcrypt.compare(iUser.password, user.password))) {
            const payload: JwtPayload = { email };
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };
        }
        else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }

    async getUserByEmail(iUser: IUser): Promise<IUser> {
        return this.usersRepository.getUserByEmail(iUser);
    }

    async getUserById(iUser: IUser): Promise<IUser> {
        return this.usersRepository.getUserById(iUser);
    }

    async updateRole(iUser: IUser, role: Role): Promise<IUser> {
        return this.usersRepository.updateRole(iUser, role);
    }


}


