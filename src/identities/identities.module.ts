import { Module } from '@nestjs/common';
import { uploadFilesProviders } from './upload-files.providers';
import { IdentitiesController } from './identities.controller';
import { IdentitiesRepository } from './identities.repository';
import { IdentitiesService } from './identities.service';
import { identityFilesProviders } from './identity-files.providers';
import { identityRejectionsProviders } from './identity-rejections.providers';
import { userIdentitiesProviders } from './user-identities.providers';
import { filesProviders } from './files.providers';

@Module({
  controllers: [IdentitiesController],
  providers: [
    IdentitiesService,
    IdentitiesRepository,
    ...userIdentitiesProviders,
    ...identityRejectionsProviders,
    ...identityFilesProviders,
    ...uploadFilesProviders,
    ...filesProviders,
  ]
})
export class IdentitiesModule {}
