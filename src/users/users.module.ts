import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { filesProviders } from 'src/common/files.providers';
import { FilesService } from '../common/files.service';
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
  providers: [UsersService, FilesService, UsersRepository, AdminService, ...usersProviders, ...filesProviders],
  exports: [UsersRepository],
})
export class UsersModule { }
