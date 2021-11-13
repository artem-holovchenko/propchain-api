import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { usersProviders } from 'src/users/users.providers';
import { UsersRepository } from 'src/users/users.repository';
import { EmailController } from './email.controller';
import { EmailRepository } from './email.repository';
import { EmailService } from './email.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: process.env.EXP_TIME,
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailRepository, UsersRepository, ...usersProviders]
})
export class EmailModule { }
