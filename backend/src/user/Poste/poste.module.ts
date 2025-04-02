import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poste } from './poste.entity';
import { PosteService } from './poste.service';
import { PosteController } from './poste.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Poste])],
  providers: [PosteService],
  controllers: [PosteController],
})
export class PosteModule {}
