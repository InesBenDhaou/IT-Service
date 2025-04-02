import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { Knowledgebase } from './Entity/knowledgebase.entity';
import { KnowledgebaseService } from './knowledgebase.service';
import { KnowledgebaseController } from './knowledgebase.controller';

@Module({
    imports : [
        TypeOrmModule.forFeature([Knowledgebase]),
        MailerModule,
        UserModule,
      ],
      providers: [KnowledgebaseService],
      controllers: [KnowledgebaseController],
      
})
export class KnowledgebaseModule {}
