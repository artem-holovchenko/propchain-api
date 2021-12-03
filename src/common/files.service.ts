import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Files } from "src/identities/files.entity";
import { resourceLimits } from "worker_threads";
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

    async delFile(file: Express.Multer.File): Promise<void> {
        const unlinkAsync = promisify(fs.unlink);
        await unlinkAsync(file.path);

    }

    async delFiles(files: Array<Express.Multer.File>): Promise<void> {

        const unlinkAsync = promisify(fs.unlink);
        for await (let f of files) {
            unlinkAsync(f.path);
        }

    }

    async uploadFile(file: Express.Multer.File) {
        let uploadResult;
        let dbResult;

        try {
            uploadResult = await cloudinary.uploader.upload(file.path, { public_id: file.originalname });
            await this.delFile(file);
        } catch (e) {
            throw new Error('failed to upload file');
        }

        try {
            dbResult = await this.filesDBRepository.create({ name: uploadResult.public_id, url: uploadResult.url });
        } catch (e) {
            await cloudinary.uploader.destroy(uploadResult.value.public_id);
            throw new Error('failed to save file data');
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
                name: res.status === 'fulfilled' ? res.value.id : 'none'
            }
        });

    }
}
