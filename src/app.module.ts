import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { PropertiesModule } from './properties/properties.module';
@Module({
  imports: [AuthModule, UsersModule, ConfigModule.forRoot({ isGlobal: true }), EmailModule, PropertiesModule],
})
export class AppModule { }