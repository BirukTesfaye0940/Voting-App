import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async createUser(username:string, password: string) {
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new this.userModel({username, password: hashedPassword})
    return user.save();
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({username}).exec();
  }

  async validateUser(username:string, password: string) {
    const user = await this.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
