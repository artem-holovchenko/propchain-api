import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Files } from "src/identities/files.entity";
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

    async uploadAvatar(file: Express.Multer.File): Promise<any> {
        try {
            const result = await cloudinary.uploader.upload(file.path);

            const unlinkAsync = promisify(fs.unlink);
            await unlinkAsync(file.path);

            return result;

        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async uploadFiles(files: Array<Express.Multer.File>): Promise<any> {
        try {
            let result = {};
            let gFiles = {};
            const unlinkAsync = promisify(fs.unlink);
            for (let i = 0; i < files.length; i++) {
                result[i] = await cloudinary.uploader.upload(files[i].path, { public_id: files[i].originalname });
                gFiles[i] = await this.filesDBRepository.create({ name: result[i].public_id, url: result[i].url });
                await unlinkAsync(files[i].path);
            }

            return gFiles;

        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}