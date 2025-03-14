import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PollSchema } from './schemas/poll.schema';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { PollGateway } from './poll.gateway';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Poll', schema: PollSchema}])],
  providers: [PollService, PollGateway],
  controllers: [PollController]
})
export class PollModule {}
