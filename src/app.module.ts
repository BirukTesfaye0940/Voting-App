import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { PollModule } from './poll/poll.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/voting-app'), UserModule, PollModule, JwtModule.register({
    secret: 'Biruk12345',
    signOptions: {expiresIn: '1h'}
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
