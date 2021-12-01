import { HttpStatus, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { IUser } from "../users/interfaces/user.interface";
import { UsersRepository } from "../users/users.repository";
import express, { Request, Response } from 'express';
import { Files } from "./files.entity";
const cloudinary = require("cloudinary").v2;
const fs = require('fs');
const { promisify } = require('util');

@Injectable()
export class FilesService {

    constructor(
        private usersRepository: UsersRepository,
        @Inject('FILES_REPOSITORY')
        private filesDBRepository: typeof Files,
    ) {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });
    }

    async uploadAvatar(user: IUser, file: Express.Multer.File, res: Response): Promise<void> {
        try {
            const result = await cloudinary.uploader.upload(file.path);
            const gUser = await this.usersRepository.getUserById(user);
            if (gUser) await cloudinary.api.delete_resources(gUser.avatarFileId);
            await this.usersRepository.setAvatar(user, result.public_id);

            const unlinkAsync = promisify(fs.unlink);
            await unlinkAsync(file.path);

            res.status(HttpStatus.OK).json({
                status: "Success",
                message: "AvatarUpdated",
            });

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