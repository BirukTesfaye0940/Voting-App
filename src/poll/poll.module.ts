import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PollSchema } from './schemas/poll.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Poll', schema: PollSchema}])]
})
export class PollModule {}
