import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { LogsService } from './logs.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Log, LogSchema } from './schemas/log.schema';
import { MailerModule } from '../mailer/mailer.module'; // Import MailerModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    MailerModule, // Include MailerModule here
  ],
  controllers: [UsersController],
  providers: [UsersService, LogsService],
  exports: [UsersService, LogsService],
})
export class UsersModule {}
