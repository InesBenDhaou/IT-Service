import { Address } from "nodemailer/lib/mailer";


export class SendEmailDto {
    from?:Address;
    recipients : Address[];
    subject:string;
    templateName: string;
    placeholderReplacements?: Record<string,string>
}