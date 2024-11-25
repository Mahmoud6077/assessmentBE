import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Module({
  providers: [MailerService],
  exports: [MailerService], // Export MailerService for use in other modules
})
export class MailerModule {}
