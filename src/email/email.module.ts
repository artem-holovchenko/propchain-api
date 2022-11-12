import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { usersProviders } from 'src/users/users.providers';
import { EmailController } from './email.controller';
import { EmailService } from '../common/email.service';
import { EmailTokenService } from 'src/common/email-token.service';

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
  providers: [EmailService, EmailTokenService, ...usersProviders],
  exports: [EmailService, EmailTokenService],
})
export class EmailModule { }
