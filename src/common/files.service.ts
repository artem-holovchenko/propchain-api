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

    async uploadAvatar(file: Express.Multer.File): Promise<any> {
        try {
            const result = await cloudinary.uploader.upload(file.path);
            await this.delFile(file);
            return result;

        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async uploadFiles(files: Array<Express.Multer.File>): Promise<any> {
         try {
        let result = [];
        let gFiles = [];
        let rejFiles = [];

        for (let f of files) {
            result.push(cloudinary.uploader.upload(f.path, { public_id: f.originalname }));
        }

        const results = await Promise.allSettled(result);

        for (let res of results) {
            if (res.status === 'fulfilled') {
                gFiles.push(this.filesDBRepository.create({ name: res.value.public_id, url: res.value.url }));
            } else {
                for await (let f of files) {
                    rejFiles.push(f.originalname);
                }
                throw new Error(`Please upload files ${rejFiles} again`);
            }
        }




        await this.delFiles(files);
        return gFiles;

         } catch (e) {
           throw new InternalServerErrorException();
         }
    }


    //TODO: divide and conquer
    async uploadFile(file: Express.Multer.File) {
        let uploadResult;
        let dbResult;

        try {
            uploadResult = await cloudinary.uploader.upload(file.path);
            await this.delFile(file);
        } catch (e) {
            throw new Error('failed to upload file')
        }

        try {
            dbResult = await this.filesDBRepository.create({ name: uploadResult.value.public_id, url: uploadResult.value.url });
        } catch (e) {
            await cloudinary.uploader.destroy(uploadResult.value.public_id);
            throw new Error('failed to save file data')
        }

        return dbResult;
    }

    async uploadBulk(files: Array<Express.Multer.File>) {
        const uploads = [];
        // Cloudinary free 10 concurrent requests
        for(let i = 0; i<files.length; i++) {
            uploads.push(this.uploadFile(files[i]));
        }

        const uploaded = await Promise.allSettled(uploads);

        return uploaded.map((res)=>{
            return {
                status: res.status === 'fulfilled' ? 'uploaded' : 'failed',
                name: res.status === 'fulfilled' ? res.value.public_id : 'none'
            }
        })

    }
}
