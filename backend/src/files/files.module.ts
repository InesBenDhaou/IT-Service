// file.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './files.entity';
import { FileService } from './files.service';
import { FileController } from './files.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileService],
  controllers : [FileController],
  exports: [FileService],
})
export class FileModule {}
