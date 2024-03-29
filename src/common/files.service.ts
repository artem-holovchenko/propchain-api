import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Files } from "src/identities/files.entity";
import { UserIdentities } from "src/identities/user-identities.entity";
import { IProperties } from "src/properties/interfaces/properties.interface";
import { Properties } from "src/properties/properties.entity";
import { IUserFiles } from "src/users/interfaces/user-files.interface";
import { IUser } from "src/users/interfaces/user.interface";
import { Status } from "src/users/status.enum";
const cloudinary = require("cloudinary").v2;
const fs = require('fs');
const { promisify } = require('util');

@Injectable()
export class FilesService {

    constructor(
        @Inject('FILES_REPOSITORY')
        private filesDBRepository: typeof Files,
    ) {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });
    }

    async getAvatar(user: IUser): Promise<IUserFiles> {
        try {
            return await this.filesDBRepository.findOne({ where: { id: user.avatarFileId } });
        } catch (e) {
            throw new Error('failed to find avatar');
        }
    }

    async delFile(file: Express.Multer.File): Promise<any> {
        let unlinkAsync;

        try {
            unlinkAsync = promisify(fs.unlink);
            await unlinkAsync(file.path);
        } catch (e) {
            throw new Error(`failed to delete file ${file.originalname}`);
        }

        return file.originalname;
    }

    async delFiles(files: Array<Express.Multer.File>): Promise<any> {
        let deleted = [];

        for (let i = 0; i < files.length; i++) {
            deleted.push(this.delFile(files[i]));
        }

        const deletedFiles = await Promise.allSettled(deleted);
        return deletedFiles.map((res) => {
            return {
                status: res.status === 'fulfilled' ? 'deleted' : 'failed',
                name: res.status === 'fulfilled' ? res.value : 'none',
                reason: res.status === 'rejected' ? res.reason : 'none',
            }
        });
    }

    async uploadFile(file: Express.Multer.File) {
        let uploadResult;
        let dbResult;

        try {
            uploadResult = await cloudinary.uploader.upload(file.path, { public_id: file.originalname });
            await this.delFile(file);
        } catch (e) {
            throw new Error(`failed to upload file ${file.originalname}`);
        }

        try {
            dbResult = await this.filesDBRepository.create({ name: uploadResult.public_id, url: uploadResult.url });
        } catch (e) {
            await cloudinary.uploader.destroy(uploadResult.public_id);
            throw new Error(`failed to save ${file.originalname} data`);
        }

        return dbResult;
    }

    async uploadBulk(files: Array<Express.Multer.File>) {
        const uploads = [];
        for (let i = 0; i < files.length; i++) {
            uploads.push(this.uploadFile(files[i]));
        }

        const uploaded = await Promise.allSettled(uploads);
        return uploaded.map((res) => {
            return {
                status: res.status === 'fulfilled' ? 'uploaded' : 'failed',
                name: res.status === 'fulfilled' ? res.value.id : 'none',
                reason: res.status === 'rejected' ? res.reason.toString() : 'none',
            }
        });

    }

    async delFilesDB(user: IUser) {
        try {
            const found = await this.filesDBRepository.findAll({
                attributes: ['id', 'name'],
                raw: true,
                include: { model: UserIdentities, attributes: [], where: { userId: user.id, status: Status.Rejected }, through: { attributes: [] } }
            });

            for (let f of found) {
                await this.filesDBRepository.destroy({ where: { id: f.id } });
                await cloudinary.uploader.destroy(f.name);
            }
        } catch {
            throw new InternalServerErrorException();
        }

    }

    async delAvatarDB(user: IUser) {
        try {
            const found = await this.filesDBRepository.findOne({ where: { id: user.avatarFileId } });
            if (found) {
                await cloudinary.uploader.destroy(found.name);
                await this.filesDBRepository.destroy({ where: { id: found.id } });
            }
        } catch {
            throw new InternalServerErrorException();
        }

    }

    async delPropertyFilesDB(property: IProperties) {
        try {
            const found = await this.filesDBRepository.findAll({
                attributes: ['id', 'name'],
                raw: true,
                include: { model: Properties, attributes: [], where: { id: property.id }, through: { attributes: [] } }
            });

            for (let f of found) {
                await this.filesDBRepository.destroy({ where: { id: f.id } });
                await cloudinary.uploader.destroy(f.name);
            }
        } catch {
            throw new InternalServerErrorException();
        }

    }
}
