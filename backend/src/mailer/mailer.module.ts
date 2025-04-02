import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports : [NotificationModule],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService], 
})
export class MailerModule {}
