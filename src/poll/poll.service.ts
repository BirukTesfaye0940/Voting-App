import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Poll } from './schemas/poll.schema';

@Injectable()
export class PollService {
  constructor(@InjectModel('Poll') private pollModel: Model<Poll>) {}

  async createPoll(title: string, options: string[], ownerId: string) {
    const joinCode = Math.random().toString(36).substring(2,10);
    const poll = new this.pollModel({
      title, options: options.map(text => ({text, votes:0, votedBy: []})),
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
    
    poll.options.push({text, votes: 0, votedBy: []});
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
    if (poll.status !== 'active') throw new HttpException('Poll not active', HttpStatus.FORBIDDEN);
    const userObjectId = new Types.ObjectId(userId);

    if (!poll.participants.some(participant => participant.equals(userObjectId))) {
      throw new HttpException('Not a participant', HttpStatus.FORBIDDEN);
    }
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      throw new HttpException('Invalid option index', HttpStatus.BAD_REQUEST);
    }
  
    const option = poll.options[optionIndex];
    if (option.votedBy.some(id => id.equals(userObjectId))) {
      throw new HttpException('You have already voted', HttpStatus.FORBIDDEN);
    }
  
    option.votes += 1;
    option.votedBy.push(userObjectId);
    poll.markModified('options');
    const updatedPoll = await poll.save();
    return updatedPoll;
  }
}
