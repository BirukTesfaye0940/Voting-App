import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { PollModule } from './poll/poll.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/voting-app'), UserModule, PollModule,AuthModule, JwtModule.register({
    secret: 'Biruk12345',
    signOptions: {expiresIn: '1h'}
  })],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
