import { HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { IUser } from "../users/interfaces/user.interface";
import { UsersRepository } from "../users/users.repository";
import express, { Request, Response } from 'express';
const cloudinary = require("cloudinary").v2;

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
            await this.usersRepository.setAvatar(user, result.public_id);

            res.status(HttpStatus.OK).json({
                status: "Success",
                message: "AvatarUpdated",
            });

        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}