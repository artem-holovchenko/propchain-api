import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { filesProviders } from 'src/identities/files.providers';
import { uploadFilesProviders } from 'src/identities/upload-files.providers';
import { userIdentitiesProviders } from 'src/identities/user-identities.providers';
import { AdminService } from './admin.service';
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
    AdminService,
    UsersService,
    UsersRepository,
    ...userIdentitiesProviders,
    ...usersProviders,
    ...uploadFilesProviders,
    ...filesProviders],
  exports: [UsersRepository],
})
export class UsersModule { }
