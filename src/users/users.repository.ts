import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { IUser } from "./interfaces/user.interface";
import { Role } from "../auth/role.enum";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { IUserEmailToken } from "./interfaces/userEmail.interface";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersRepository {

    constructor(
        @Inject('USERS_REPOSITORY')
        private usersDBRepository: typeof User,
        private jwtService: JwtService,
    ) { }

    async getUserByEmail(user: IUser): Promise<IUser> {
        return await this.usersDBRepository.findOne({ where: { email: user.email } });
    }

    async getUserById(user: IUser): Promise<IUser> {
        const found = await this.usersDBRepository.findOne({ where: { id: user.id } });
        if (!found) {
            throw new NotFoundException(`User with id: ${user.id} not found`);
        }
        return found;
    }

    async updateRole(user: IUser, role: Role): Promise<IUser> {
        await this.usersDBRepository.update({ role: role }, { where: { id: user.id } });
        const fUser = await this.getUserById(user);
        return fUser;
    }

    async updateEmail(user: IUser): Promise<void> {
        await this.usersDBRepository.update({ emailIsVerified: true }, { where: { email: user.email } });
    }

    async resetPassword(userEmailToken: IUserEmailToken, password: string): Promise<void> {
        const gId = await this.jwtService.decode(userEmailToken.token) as IUser;
        const gen_salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, gen_salt);
        await this.usersDBRepository.update({ password: hashedPassword, salt: gen_salt }, { where: { email: gId.email } });
    }

    async setAvatar(user: IUser, fileId: string): Promise<void> {
        try {
            const { id } = user;
            await this.usersDBRepository.update({ avatarFileId: fileId }, { where: { id: id } });
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async deleteUserByEmail(user: IUser): Promise<void> {
        await this.usersDBRepository.destroy({ where: { email: user.email } });
    }

    async getAllUsers(): Promise<IUser[]> {
        return await this.usersDBRepository.findAll({
            attributes: [
                'firstName',
                'lastName',
                'username',
                'phone',
                'email',
                'emailIsVerified',
                'isUsaCitizen',
                'avatarFileId',
            ]
        });
    }
}