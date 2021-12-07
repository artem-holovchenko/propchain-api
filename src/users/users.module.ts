import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { FilesService } from '../common/files.service';
import { userIdentitiesProviders } from './user-identities.providers';
import { filesProviders } from 'src/identities/files.providers';
import { uploadFilesProviders } from 'src/identities/upload-files.providers';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: process.env.EXP_TIME,
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    ...usersProviders,
    ...uploadFilesProviders,
    ...filesProviders],
  exports: [UsersRepository],
})
export class UsersModule { }
