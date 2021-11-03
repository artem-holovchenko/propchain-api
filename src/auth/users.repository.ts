import { Inject, Injectable } from "@nestjs/common";
import { User } from "./user.entity";

@Injectable()
export class UsersRepository {

    constructor(
        @Inject('USERS_REPOSITORY')
        private usersRepository: typeof User
    ) { }

}