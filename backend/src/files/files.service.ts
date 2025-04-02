// file.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FileEntity } from './files.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async saveFileEntities(fileEntities: FileEntity[]): Promise<void> {
    await this.fileRepository.save(fileEntities);
  }

  async findByUniqueName(uniqueName: string): Promise<FileEntity | undefined> {
    return this.fileRepository.findOne({ where: { uniqueName } });
  }

  async findOriginalNamesByUniqueNames(uniqueNames: string[]): Promise<Map<string, string>> {
    const files = await this.fileRepository.find({
      where: {
        uniqueName: In(uniqueNames), 
      },
    });
    const result = new Map<string, string>();
    files.forEach(file => result.set(file.uniqueName, file.originalName));

    return result;
  }

  async deleteFileByUniqueName(uniqueName: string): Promise<void> {
    const file = await this.findByUniqueName(uniqueName);
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    await this.fileRepository.delete({ uniqueName: file.uniqueName });
  }
}
