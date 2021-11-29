import { HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { IUser } from "../users/interfaces/user.interface";
import { UsersRepository } from "../users/users.repository";
import express, { Request, Response } from 'express';
const cloudinary = require("cloudinary").v2;
const fs = require('fs');
const { promisify } = require('util');

@Injectable()
export class FilesService {

    constructor(
        private usersRepository: UsersRepository
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

    async uploadFiles(user: IUser, files: Array<Express.Multer.File>, res: Response): Promise<void> {
      //  try {
            let result = {};
            const unlinkAsync = promisify(fs.unlink);
            const fIdentity = await this.usersRepository.getWaitingUser(user);
            if (!fIdentity) {
                await this.usersRepository.setStatus(user);
                for (let i = 0; i < files.length; i++) {
                    result[i] = await cloudinary.uploader.upload(files[i].path, { public_id: files[i].originalname });
                    await unlinkAsync(files[i].path);
                    await this.usersRepository.setFiles(user, result[i].public_id, result[i].url);
                }

                res.status(HttpStatus.OK).json({
                    status: "Success",
                    message: "FilesUploaded",
                });
            }

    //    } catch (e) {
       //     throw new InternalServerErrorException();
      //  }
    }
}