import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { IUser } from "./interfaces/user.interface";
import { Role } from "./role.enum";

@Injectable()
export class UsersRepository {

    constructor(
        @Inject('USERS_REPOSITORY')
        private usersRepository: typeof User
    ) { }

    async createUser(iUser: IUser): Promise<IUser> {
        const gen_salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(iUser.password, gen_salt);
        try {
            const user = await this.usersRepository.create({
                firstName: iUser.firstName,
                lastName: iUser.lastName,
                username: iUser.username,
                phone: iUser.phone,
                email: iUser.email,
                password: hashedPassword,
                salt: gen_salt,
                role: Role.User,
            });

            const rUser = {
                username: user.username,
                email: user.email,
                role: user.role,
            }

            return rUser;

        } catch (error) {
            throw new ConflictException(error.message);
        }
    }

    async getUserByEmail(iUser: IUser): Promise<IUser> {
        return await this.usersRepository.findOne({ where: { email: iUser.email } });
    }

    async getUserById(iUser: IUser): Promise<IUser> {
        const found = await this.usersRepository.findOne({ where: { id: iUser.id } });
        if (!found) {
            throw new NotFoundException(`User with id: ${iUser.id} not found`);
        }
        return found;
    }

    async updateRole(iUser: IUser, role: Role): Promise<IUser> {
        await this.usersRepository.update({ role: role }, { where: { id: iUser.id } });
        const fUser = await this.getUserById(iUser);
        return fUser;
    }
}