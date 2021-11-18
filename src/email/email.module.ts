import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { usersProviders } from 'src/users/users.providers';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: process.env.EXP_TIME,
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, ...usersProviders],
  exports: [EmailService],
})
export class EmailModule { }
