import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Localisation } from './localisation.entity';
import { LocalisationService } from './localisation.service';
import { LocalisationController } from './localisation.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Localisation])],
  providers: [LocalisationService],
  controllers: [LocalisationController],
})
export class LocalisationModule {}
