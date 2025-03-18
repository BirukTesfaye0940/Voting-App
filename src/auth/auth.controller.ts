import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService, private userService: UserService){}

  @Post('register')
  async register(@Body() body: {username: string; password: string}) {
    const user = await this.userService.createUser(body.username, body.password);
    return { userId: user.id, username: user.username };
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if(!user) throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED)
      const token = await this.authService.login(user);
      return { ...token, userId: user.id, username: user.username };
  }
}
