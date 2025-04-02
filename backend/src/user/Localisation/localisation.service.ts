import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocalisationDto } from './localisation.dto';
import { Localisation } from './localisation.entity';


@Injectable()
export class LocalisationService {
  constructor(
    @InjectRepository(Localisation)
    private localisationRepository: Repository<Localisation>,
  ) {}

  findAll(): Promise<Localisation[]> {
    return this.localisationRepository.find();
  }

  async create(createLocalisationDto: CreateLocalisationDto): Promise<Localisation> {
    const localisation = this.localisationRepository.create(createLocalisationDto);
    return this.localisationRepository.save(createLocalisationDto);
  }

  async delete(id: number): Promise<void> {
    await this.localisationRepository.delete(id);
  }

}
