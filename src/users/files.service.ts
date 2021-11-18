import { HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { IUser } from "./interfaces/user.interface";
import { UsersRepository } from "./users.repository";
import express, {Request, Response} from 'express';

@Injectable()
export class FilesService {
    constructor(
        private usersRepository: UsersRepository
    ) { }

    async uploadAvatar(user: IUser, file: Express.Multer.File, res: Response): Promise<void> {
        const cloudinary = require("cloudinary").v2;
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });

        try {
            const result = await cloudinary.uploader.upload(file.path);
            await this.usersRepository.setAvatar(user, result.public_id);
            console.log("success", JSON.stringify(result, null, 2));

            res.status(HttpStatus.OK).json({
                status: "Success",
                message: "AvatarUpdated",
            });

        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}