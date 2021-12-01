import { Injectable } from '@nestjs/common';
import { IRejectFiles } from 'src/identities/interfaces/reject-files.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { IdentitiesRepository } from './identities.repository';

@Injectable()
export class IdentitiesService {
    constructor(
        private identitiesRepository: IdentitiesRepository,
    ) { }

    async verifyId(user: IUser, files: Array<Express.Multer.File>): Promise<void> {
        return this.identitiesRepository.verifyId(user, files);
    }

    async approveId(user: IUser): Promise<void> {
        return this.identitiesRepository.approveId(user);
    }

    async rejectId(rejectFiles: IRejectFiles): Promise<void> {
        return this.identitiesRepository.rejectId(rejectFiles);
    }
}
