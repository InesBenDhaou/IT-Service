import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/Entity/user.entity';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailerService } from 'src/mailer/mailer.service';
@Module({
    imports : [
        TypeOrmModule.forFeature([User]),
        MailerModule ,
      ],
      providers: [UserService],
      controllers: [UsersController],
      exports: [UserService],
})
export class UserModule {}
