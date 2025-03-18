import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PollService } from './poll.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';

@WebSocketGateway(
  {
    cors: {
      origin: 'http://localhost:5173', // Your frontend URL
      methods: ['GET', 'POST'],
      credentials: true,
    },
  }
)
export class PollGateway {
  @WebSocketServer() server: Server;

  constructor(private pollService: PollService) { }

  @SubscribeMessage('joinPoll')
  @UseGuards(AuthGuard('jwt'))
  async handleJoin(client: any, payload: { pollId: string; joinCode: string }, @GetUser() user: any) {
    const poll = await this.pollService.joinPoll(payload.pollId, payload.joinCode, user.userId);
    client.join(payload.pollId);
    this.server.to(payload.pollId).emit('pollUpdate', poll);
  }

  @SubscribeMessage('vote')
  @UseGuards(AuthGuard('jwt'))
  async handleVote(client: any, payload: { pollId: string; optionIndex: number }, @GetUser() user: any) {
    const poll = await this.pollService.vote(payload.pollId, payload.optionIndex, user.userId);
    this.server.to(payload.pollId).emit('pollUpdate', poll);
  }
}