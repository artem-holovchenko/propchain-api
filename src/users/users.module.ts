import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from 'src/email/email.module';
import { EmailRepository } from 'src/email/email.repository';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    EmailModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: process.env.EXP_TIME,
      },
    }), PassportModule.register({ defaultStrategy: 'jwt' }),],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, EmailRepository, ...usersProviders,]
})
export class UsersModule { }
