import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';
import { IUser } from 'src/users/interfaces/user.interface';
import { FilesService } from 'src/common/files.service';

@Injectable()
export class AuthService {
    constructor(
        private authRepository: AuthRepository,
        private usersRepositoryAuth: UsersRepository,
        private jwtService: JwtService,
        @Inject('UPLOAD_FILES_REPOSITORY')
        private uploadFilesProviders: FilesService,
    ) { }

    async signUp(user: IUser): Promise<IUser> {
        return this.authRepository.createUser(user);
    }

    async signIn(user: IUser): Promise<IUser> {
        const gUser = await this.usersRepositoryAuth.getUserByEmail(user);
        const gFile = await this.uploadFilesProviders.getAvatar(gUser);
        const { email } = user;
        if (gUser && (await bcrypt.compare(user.password, gUser.password))) {
            if (gUser.emailIsVerified == true) {
                const payload: JwtPayload = { email };
                const accessToken: string = await this.jwtService.sign(payload);
                let url = null;
                if (gFile) {
                    url = gFile.url;
                }
                const rUser = {
                    id: gUser.id,
                    firstName: gUser.firstName,
                    lastName: gUser.lastName,
                    username: gUser.username,
                    phone: gUser.phone,
                    email: gUser.email,
                    avatarUrl: url,
                    role: gUser.role,
                    token: accessToken,
                }


                return rUser;
            } else {
                throw new UnauthorizedException('Please confirm your email');
            }
        }
        else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }
}


