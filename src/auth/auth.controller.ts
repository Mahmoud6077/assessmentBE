import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';
import { Request } from 'express';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() loginUserDto: LoginUserDto, @Req() req: Request) {
    return this.authService.signIn(loginUserDto, req);
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  async signOut(@GetUser('userId') userId: string, @Req() req: Request) {
    await this.authService.signOut(userId, req);
    return { message: 'User logged out successfully' };
  }
}
