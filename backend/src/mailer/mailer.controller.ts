import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('sendWelcomeMail')
  async sendWelcomeMail(@Body() body: { name: string; email: string; password: string }) {
    return await this.mailerService.sendNewUserEmail(body);
  }

  @Post('sendNotificationMail')
  async sendNotificationMail(@Body() body: { name: string; email: string; message: string ; url:string}) {
    return await this.mailerService.sendNotificationEmail(body);
  }
}
