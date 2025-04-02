import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/demande/Categories/Entity/category.entity'; // Adjust import path as necessary
import { Component } from './Entity/component.entity';
import { ComponentDTO, OneComponentDTO } from './DTO/component.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(Component)
    private componentRepository: Repository<Component>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Component[]> {
    return this.componentRepository.find({ relations: ['category'] });
  }

  async findOne (id:number) : Promise<Component> {
    return this.componentRepository.findOne({where : {id:id}});
  }
 
  async create(componentDTO: ComponentDTO, categoryName: string): Promise<Component> {
    const category = await this.categoryRepository.findOne({where: {name : categoryName } });
    if (!category) {
      throw new NotFoundException(`Category with name ${categoryName} not found`);
    }

    const newComponent = new Component();
    newComponent.name = componentDTO.name;
    newComponent.componentImg = componentDTO.componentImg;
    newComponent.description = componentDTO.description;
    newComponent.category = category;
    return this.componentRepository.save(newComponent);
  }

  async delete(id: number): Promise<void> {
    const component = await this.componentRepository.findOne({ where: { id }});
    const imagePath = path.join('images', 'componentimages', component.componentImg);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (error) {
        throw new HttpException('Failed to delete image from filesystem', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } 
    else {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
    const result = await this.componentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }
  }


  async update (id:number , component: ComponentDTO) : Promise<any> {
      return await this.componentRepository.update(id,component);
    }
}
