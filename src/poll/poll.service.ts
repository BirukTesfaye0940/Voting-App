import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Poll } from './schemas/poll.schema';
import { nanoid } from 'nanoid';

@Injectable()
export class PollService {
  constructor(@InjectModel('Poll') private pollModel: Model<Poll>) {}

  async createPoll(title: string, options: string[], ownerId: string) {
    const joinCode = nanoid(8);
    const poll = new this.pollModel({
      title, options: options.map(text => ({text})),
      joinCode,
      owner : ownerId
    })
    return poll.save();
  }

  async findById(pollId: string) {
    return this.pollModel.findById(pollId).exec();
  }

  async joinPoll(pollId: string, joinCode: string, userId: string) {
    const poll = await this.pollModel.findById(pollId);
    if (!poll) throw new HttpException('Poll not found', HttpStatus.NOT_FOUND);

    if (poll.joinCode !== joinCode) throw new HttpException('Invalid Join code', HttpStatus.UNAUTHORIZED);

    const userObjectId = new Types.ObjectId(userId);

    if(!poll.participants.includes(userObjectId)) {
      poll.participants.push(userObjectId);}
    return poll.save()
  }

  async addOption(pollId: string, text: string, userId: string) {
    const poll = await this.pollModel.findById(pollId);
    if (!poll) throw new HttpException('Poll not found', HttpStatus.NOT_FOUND);

    if(poll.status !== 'pending') throw new HttpException('Poll already started', HttpStatus.UNAUTHORIZED)
    
    const userObjectId = new Types.ObjectId(userId);
    if (!poll.participants.includes(userObjectId)) throw new HttpException('Not a participant', HttpStatus.FORBIDDEN);
    
    poll.options.push({text, votes: 0});
    return poll.save();
  }

  async startPoll(pollId: string, ownerId: string) {
    const poll = await this.pollModel.findById(pollId);
    if (!poll) throw new HttpException('Poll not found', HttpStatus.NOT_FOUND);
    if (poll.owner.toString() !== ownerId) throw new HttpException('Unauthorized', 402);
    poll.status = 'active';
    return poll.save();
  }
  
  async closePoll(pollId: string, ownerId: string) {
    const poll = await this.pollModel.findById(pollId);
    if (!poll) throw new HttpException('Poll not found', HttpStatus.NOT_FOUND);
    if (poll.owner.toString() !== ownerId) throw new HttpException('Unauthorized', 402);
    poll.status = 'closed';
    return poll.save();
  }
  
  async vote(pollId: string, optionIndex: number, userId: string) {
    const poll = await this.pollModel.findById(pollId);
    if (!poll) throw new HttpException('Poll not found', HttpStatus.NOT_FOUND);
    if (poll.status !== 'active') throw new Error('Poll not active');
    if (!poll.participants.includes(new Types.ObjectId(userId))) throw new HttpException('Not a participant', 404);
    poll.options[optionIndex].votes += 1;
    return poll.save();
  }
}
