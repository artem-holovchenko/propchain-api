import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { IUser } from "./interfaces/user.interface";
import { Role } from "../auth/role.enum";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { IUserEmailToken } from "./interfaces/userEmail.interface";
import { JwtService } from "@nestjs/jwt";
import { Status } from "./status.enum";
import { FilesService } from "src/common/files.service";
import { UserIdentities } from "src/identities/user-identities.entity";
import { IUserIdentity } from "src/identities/interfaces/user-identity.interface";

@Injectable()
export class UsersRepository {

    constructor(
        @Inject('USERS_REPOSITORY')
        private usersDBRepository: typeof User,
        @Inject('USER_IDENTITIES_REPOSITORY')
        private userIdentitiesDBRepository: typeof UserIdentities,
        private jwtService: JwtService,
        @Inject('UPLOAD_FILES_REPOSITORY')
        private uploadFilesProviders: FilesService,
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

    async getWaitingUsers(): Promise<IUserIdentity[]> {
        const found = await this.userIdentitiesDBRepository.findAll({
            attributes: ['status'], where: { status: Status.Waiting }, include: [{
                model: User,
                attributes: [
                    'firstName',
                    'lastName',
                    'username',
                    'phone',
                ]
            }]
        });
        
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

    async setAvatar(user: IUser, file: Express.Multer.File): Promise<void> {
        try {
            const gFile = await this.uploadFilesProviders.uploadFile(file);
            const { id } = user;
            await this.usersDBRepository.update({ avatarFileId: gFile.name }, { where: { id: id } });
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
                'id',
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

    async createAdmin(): Promise<void> {
        const gUser = await this.usersDBRepository.findOne({ where: { email: "admin@gmail.com" } });
        if (!gUser) {
            const gen_salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash('AdminPassw1!', gen_salt);
            await this.usersDBRepository.create({
                username: "Admin",
                email: "admin@gmail.com",
                password: hashedPassword,
                salt: gen_salt,
                emailIsVerified: true,
                role: Role.Admin,
            });
        }
    }
}