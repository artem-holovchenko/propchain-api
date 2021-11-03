import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { usersProviders } from './users.providers';
import { UsersRepository } from './users.repository';
import { DatabaseModule } from 'src/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [
    UsersRepository,
    AuthService,
    ...usersProviders,],
  controllers: [AuthController],
})
export class AuthModule { }
