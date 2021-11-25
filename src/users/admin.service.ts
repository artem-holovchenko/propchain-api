import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class AdminService implements OnModuleInit {
    constructor(
        private usersRepository: UsersRepository
    ) { }

    async onModuleInit(): Promise<void> {
        return this.usersRepository.createAdmin();
    }
}
