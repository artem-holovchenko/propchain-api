import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { IUser } from "./interfaces/user.interface";
import { Role } from "../auth/role.enum";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { IUserEmailToken } from "./interfaces/userEmail.interface";
import { JwtService } from "@nestjs/jwt";
import { UserIdentities } from "./user-identities.entity";
import { Files } from "./files.entity";
import { IdentityRejections } from "./identity-rejections.entity";
import { IdentityFiles } from "./identity-files.entity";
import { IUserIdentity } from "./interfaces/user-identity.interface";
import { Status } from "./status.enum";
import { IRejectFiles } from "./interfaces/reject-files.interface";

@Injectable()
export class UsersRepository {

    constructor(
        @Inject('USERS_REPOSITORY')
        private usersDBRepository: typeof User,
        @Inject('USER_IDENTITIES_REPOSITORY')
        private userIdentitiesDBRepository: typeof UserIdentities,
        @Inject('FILES_REPOSITORY')
        private filesDBRepository: typeof Files,
        @Inject('IDENTITY_REJECTIONS_REPOSITORY')
        private identityRejectionsDBRepository: typeof IdentityRejections,
        @Inject('IDENTITY_FILES_REPOSITORY')
        private identityFilesDBRepository: typeof IdentityFiles,
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

    async getWaitingUser(user: IUser): Promise<IUserIdentity> {
        const { id } = user;
        return await this.userIdentitiesDBRepository.findOne({ where: { userId: id, status: Status.Waiting } });
    }

    async setStatus(user: IUser): Promise<void> {
        try {
            const { id } = user;
            const fIdentity = await this.getWaitingUser(user);
            if (!fIdentity) {
                await this.userIdentitiesDBRepository.create({ userId: id, status: Status.Waiting });
            }

        } catch {
            throw new InternalServerErrorException();
        }
    }

    async setFiles(user: IUser, name: string, url: string): Promise<void> {
        try {
            const gFile = await this.filesDBRepository.create({ name: name, url: url });

            const { id } = user;
            const fIdentity = await this.userIdentitiesDBRepository.findOne({ where: { userId: id, status: Status.Waiting } });
            if (fIdentity) {
                await this.identityFilesDBRepository.create({ identityId: fIdentity.id, fileId: gFile.id });
            }
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async approveFiles(user: IUser): Promise<void> {
        try {
            const { id } = user;
            await this.userIdentitiesDBRepository.update({ status: Status.Approved }, { where: { userId: id } });
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async rejectFiles(rejectFiles: IRejectFiles): Promise<void> {
        try {
            const gId = await this.userIdentitiesDBRepository.findOne({ where: { userId: rejectFiles.userId } });
            await this.userIdentitiesDBRepository.update({ status: Status.Rejected }, { where: { userId: rejectFiles.userId } });
            await this.identityRejectionsDBRepository.create({ identityId: gId.id, description: rejectFiles.description });
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