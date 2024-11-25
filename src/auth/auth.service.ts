import * as os from 'os';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LogsService } from '../users/logs.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private logsService: LogsService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    loginUserDto: LoginUserDto,
    req: Request, // request to get IP and user-agent
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update isActive and lastLoggedIn
    const userId: string = (user._id as string).toString();
    await this.usersService.updateIsActive(userId, true);
    await this.usersService.updateLastLoggedIn(userId);

    // Create a login log
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    const machineName = os.hostname();
    const operatingSystem = os.type();

    await this.logsService.createLog({
      userId,
      action: 'login',
      ipAddress,
      userAgent,
      machineName,
      operatingSystem,
    });

    const payload = { email: user.email, sub: userId };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async signOut(userId: string, req: Request): Promise<void> {
    // Set isActive to false
    await this.usersService.updateIsActive(userId, false);

    // Create a logout log
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    const machineName = os.hostname();
    const operatingSystem = os.type();

    await this.logsService.createLog({
      userId,
      action: 'logout',
      ipAddress,
      userAgent,
      machineName,
      operatingSystem,
    });
  }
}
