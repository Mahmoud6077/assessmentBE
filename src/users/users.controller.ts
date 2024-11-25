import { Body, Controller, Post,Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { MailerService } from '../mailer/mailer.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private mailerService: MailerService,
  ) {}


  // Endpoint to fetch and log indexes
  @Get('indexes')
  async getIndexes() {
    return await this.usersService.getIndexes();
  }

  @Post('signup')
async signup(@Body() createUserDto: CreateUserDto) {
  try {
    const user = await this.usersService.create(createUserDto);
    return { message: 'User created successfully', user };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to create user:', error.message);
      throw new HttpException(error.message || 'Signup failed.', HttpStatus.BAD_REQUEST);
    }
    console.error('Unexpected error:', error);
    throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


  @Post('forget-password')
  async forgetPassword(@Body('email') email: string) {
    const resetToken = await this.usersService.generateResetToken(email);
    await this.mailerService.sendPasswordResetEmail(email, resetToken);
    return { message: 'Password reset email sent' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.usersService.resetPassword(token, newPassword);
    return { message: 'Password successfully reset' };
  }
}
