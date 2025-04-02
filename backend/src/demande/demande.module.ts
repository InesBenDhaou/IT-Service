import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Demande } from './Entity/demande.entity';
import { DemandeService } from './demande.service';
import { DemandeController } from './demande.controller';
import { Category } from './Categories/Entity/category.entity';
import { Component } from './Composants/Entity/component.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/files/files.module';

@Module({
    imports : [
        TypeOrmModule.forFeature([Demande]),
        TypeOrmModule.forFeature([Category]),
        TypeOrmModule.forFeature([Component]),
        MailerModule,
        UserModule,
        FileModule
      ],
      providers: [DemandeService],
      controllers: [DemandeController]
})
export class DemandeModule {}
