import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poste } from './poste.entity';
import { CreatePosteDto } from './poste.dto';
import { Department } from '../Department/department.entity';


@Injectable()
export class PosteService {
  constructor(
    @InjectRepository(Poste)
    private posteRepository: Repository<Poste>,
  ) {}

  findAll(): Promise<Poste[]> {
    return this.posteRepository.find({ relations: ['department'] });
  }

  async create(createPosteDto: CreatePosteDto): Promise<Poste> {
    const poste = this.posteRepository.create(createPosteDto);
    return this.posteRepository.save(poste);
  }

  async delete(id: number): Promise<void> {
    await this.posteRepository.delete(id);
  }
}
