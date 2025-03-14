import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PollService } from './poll.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload';

@Controller('poll')
@UseGuards(AuthGuard('jwt'))
export class PollController {
  constructor(private pollService: PollService) {}

  @Post()
  createPoll(@Body() body: {title: string; options: string[]}, @GetUser() user:any) {
    return this.pollService.createPoll(body.title, body.options, user.userId)
  }

  @Post(':id/join')
  @UseGuards(AuthGuard('jwt'))
  joinPoll(
    @Param('id') id: string,
    @Body('joinCode') joinCode: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.pollService.joinPoll(id, joinCode, user.userId)
  }

  @Post(':id/options')
  @UseGuards(AuthGuard('jwt'))
  addOption(
    @Param('id') id:string,
    @Body('text') text:string,
    @GetUser() user: JwtPayload
  ) {
    return this.pollService.addOption(id, text, user.userId);
  }

  @Post(':id/start')
@UseGuards(AuthGuard('jwt'))
startPoll(@Param('id') id: string, @GetUser() user: any) {
  return this.pollService.startPoll(id, user.userId);
}

@Post(':id/close')
@UseGuards(AuthGuard('jwt'))
closePoll(@Param('id') id: string, @GetUser() user: any) {
  return this.pollService.closePoll(id, user.userId);
}

@Post(':id/vote')
@UseGuards(AuthGuard('jwt'))
vote(
  @Param('id') id: string,
  @Body('optionIndex') optionIndex: number,
  @GetUser() user: any,
) {
  return this.pollService.vote(id, optionIndex, user.userId);
}
} 

