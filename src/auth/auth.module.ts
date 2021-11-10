import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { usersProviders } from '../users/users.providers';
import { AuthRepository } from './auth.repository';
import { DatabaseModule } from 'src/database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy';
import { UsersModule } from 'src/users/users.module';
import { UsersRepository } from 'src/users/users.repository';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: process.env.EXP_TIME,
      },
    }),
  ],
  providers: [
    JwtStrategy,
    AuthRepository,
    AuthService,
    UsersRepository,
    ...usersProviders,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule { }
