import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './Entity/category.entity';
import { Component } from '../Composants/Entity/component.entity';
import { CategoryDTO } from './DTO/category.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['components'] });
  }

  async findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOne({ where: { id }, relations: ['components']});
  }
  
  async create(categoryDTO : CategoryDTO): Promise<CategoryDTO> {
    return this.categoryRepository.save(categoryDTO);
  }


  async delete(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: ['components']});
    if (category.components && category.components.length > 0) {
      throw new BadRequestException('Cannot delete this category as it has associated components.');
    }
    const imagePath = path.join('images', 'categoryimages', category.categoryImg);
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
    await this.categoryRepository.delete(id);
  }


  async updateName(id: number, newName: string): Promise<any> {
    const category = await this.categoryRepository.findOne({where : {id}});
    category.name = newName;
    return this.categoryRepository.update(id,category);
  }


}
