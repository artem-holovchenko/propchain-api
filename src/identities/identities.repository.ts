import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { IdentityFiles } from "src/identities/identity-files.entity";
import { IdentityRejections } from "src/identities/identity-rejections.entity";
import { IRejectFiles } from "src/identities/interfaces/reject-files.interface";
import { IUserIdentity } from "src/identities/interfaces/user-identity.interface";
import { IUser } from "src/users/interfaces/user.interface";
import { Status } from "src/users/status.enum";
import { UserIdentities } from "src/identities/user-identities.entity";
import { FilesService } from "src/common/files.service";
import { IGetFile } from "./interfaces/get-file.interface";

@Injectable()
export class IdentitiesRepository {

    constructor(
        @Inject('USER_IDENTITIES_REPOSITORY')
        private userIdentitiesDBRepository: typeof UserIdentities,
        @Inject('IDENTITY_REJECTIONS_REPOSITORY')
        private identityRejectionsDBRepository: typeof IdentityRejections,
        @Inject('IDENTITY_FILES_REPOSITORY')
        private identityFilesDBRepository: typeof IdentityFiles,
        @Inject('UPLOAD_FILES_REPOSITORY')
        private uploadFilesProviders: FilesService,
    ) { }

    async getWaitingUser(user: IUser): Promise<IUserIdentity> {
        const { id } = user;
        return await this.userIdentitiesDBRepository.findOne({ where: { userId: id, status: Status.Waiting } });
    }

    async verifyId(user: IUser, files: Array<Express.Multer.File>): Promise<any> {
        const gStatus = await this.getWaitingUser(user);
        if (!gStatus) {
            await this.setStatus(user);
            const gFiles = await this.uploadFilesProviders.uploadBulk(files);
            const getFiles = await Promise.allSettled(gFiles);
            return getFiles.map((res) => {
                if (res.status === "fulfilled") {
                    if (res.value.status === "uploaded") {
                        this.setFiles(user, res.value.name);
                        return res.value;
                    } else {
                        return res.value.reason;
                    }
                }
            });

        } else {
            await this.uploadFilesProviders.delFiles(files);
        }
    }

    async setFiles(user: IUser, file: IGetFile): Promise<void> {
        try {
            const { id } = user;
            const fIdentity = await this.userIdentitiesDBRepository.findOne({ where: { userId: id, status: Status.Waiting } });
            if (fIdentity) {
                await this.identityFilesDBRepository.create({ identityId: fIdentity.id, fileId: file });
            }
        } catch {
            throw new InternalServerErrorException();
        }
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

    async approveId(user: IUser): Promise<void> {
        try {
            const { id } = user;
            await this.userIdentitiesDBRepository.update({ status: Status.Approved }, { where: { userId: id } });
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async rejectId(rejectFiles: IRejectFiles): Promise<void> {
        try {
            const gId = await this.userIdentitiesDBRepository.findOne({ where: { userId: rejectFiles.userId } });
            await this.userIdentitiesDBRepository.update({ status: Status.Rejected }, { where: { userId: rejectFiles.userId } });
            await this.identityRejectionsDBRepository.create({ identityId: gId.id, description: rejectFiles.description });
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async deleteId(user: IUser): Promise<void> {
        try {
            await this.uploadFilesProviders.delFilesDB(user);

            const gId = await this.userIdentitiesDBRepository.findOne({ where: { userId: user.id, status: Status.Rejected } });
            await this.identityRejectionsDBRepository.destroy({ where: { identityId: gId.id } });
            await this.userIdentitiesDBRepository.destroy({ where: { userId: user.id } });
        } catch {
            throw new InternalServerErrorException();
        }
    }

}