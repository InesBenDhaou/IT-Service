import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './Entity/ticket.entity';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { User } from 'src/user/Entity/user.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/files/files.module';



@Module({
    imports : [
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Ticket]),
        MailerModule,
        UserModule,
        FileModule
      ],
      providers: [TicketService],
      controllers: [TicketController]
})
export class TicketModule {}
