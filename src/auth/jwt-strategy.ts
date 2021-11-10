import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { UsersRepository } from "src/users/users.repository";
import { IUser } from "src/users/interfaces/user.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersRepository: UsersRepository,
    ) {
        super({
            secretOrKey: process.env.SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(email: JwtPayload): Promise<IUser> {
        const user = await this.usersRepository.getUserByEmail(email);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}