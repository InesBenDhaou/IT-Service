import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SendEmailDto } from './DTO/mail.dto';
import Mail from 'nodemailer/lib/mailer';
import * as fs from 'fs';
import * as path from 'path';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
 
  constructor(private notificationService: NotificationService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    } as SMTPTransport.Options);
  }

  private loadTemplate(templateName: string): string {
    const templatePath = path.join(process.cwd(), 'src/mailer/templates/'+`${templateName}.html`);
    return fs.readFileSync(templatePath, 'utf8');
  }

  private template(html: string, replacements: Record<string, string>): string {
    return html.replace(/%(\w*)%/g, (m, key) => replacements.hasOwnProperty(key) ? replacements[key] : '');
  }


  async sendNewUserEmail(body: { name: string; email: string; password: string }) {
    const from = { name: 'contact', address: 'contact@helpdesk.anyinit.com' };
    const recipients = [{ name: body.name, address: body.email }];
    const subject = 'Welcome to itService';
    const templateName = 'welcome'; 
    const placeholderReplacements = body;
    let html = this.loadTemplate(templateName);
    if (placeholderReplacements) {
      html = this.template(html, placeholderReplacements);
    }
    const options: Mail.Options = {
      from: from ?? {
        name: process.env.APP_NAME,
        address: process.env.DEFAULT_MAIL_FROM,
      },
      to: recipients,
      subject,
      html,
    };
    try {
      await this.notificationService.createNotification(body.email, 'bienvenue sur notre plateforme',"");
      const result = await this.transporter.sendMail(options);
      return result;
    } catch (error) {
      console.log('Error: Failed sending email', error);
    }
  }


  async sendNotificationEmail(body: { name: string; email: string; message: string ; url:string}) {
    const from = { name: 'contact', address: 'contact@helpdesk.anyinit.com' };
    const recipients = [{ name: body.name, address: body.email }];
    const subject = 'New Notification  from itService';
    const templateName = 'notification'; 
    const url = body.url ;
    body.url = "https://helpdesk.anyinit.com"+body.url;
    const placeholderReplacements = body;
    let html = this.loadTemplate(templateName);
    if (placeholderReplacements) {
      html = this.template(html, placeholderReplacements);
    }
    const options: Mail.Options = {
      from: from ?? {
        name: process.env.APP_NAME,
        address: process.env.DEFAULT_MAIL_FROM,
      },
      to: recipients,
      subject,
      html,
    };
    try {
      await this.notificationService.createNotification(body.email, body.message ,url);
      const result = await this.transporter.sendMail(options);
      return result;
    } catch (error) {
      console.log('Error: Failed sending email', error);
    }
  }

   
}
