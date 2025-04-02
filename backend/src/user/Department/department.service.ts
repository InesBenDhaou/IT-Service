import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { CreateDepartementDto } from './department.dto';
import { Poste } from '../Poste/poste.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departementRepository: Repository<Department>,
  ) {}

  findAll(): Promise<Department[]> {
    return this.departementRepository.find({
      relations: ['postes'],
      order: {
        id: 'ASC',
      },
    });
  }

  async create(createDepartementDto: CreateDepartementDto): Promise<Department> {
    const departement = this.departementRepository.create(createDepartementDto);
    return this.departementRepository.save(departement);
  }

  async delete(id: number): Promise<void> {
    const departement = await this.departementRepository.findOne({ where: { id }, relations: ['postes']});
    if (departement.postes && departement.postes.length > 0) {
      throw new BadRequestException('Cannot delete this departement as it has associated posts.');
    }
    await this.departementRepository.delete(id);
  }

  async findPostesByDepartementId(id: number): Promise<Poste[]> {
    const departement = await this.departementRepository.findOne({
      where: { id },
      relations: ['postes'],
    });
    if (!departement) {
      throw new NotFoundException(`Departement with ID ${id} not found`);
    }
    return departement.postes;
  }
}
