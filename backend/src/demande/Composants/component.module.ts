import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './Entity/component.entity';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { Category } from '../Categories/Entity/category.entity';

@Module({
    imports : [
        TypeOrmModule.forFeature([Component]),
        TypeOrmModule.forFeature([Category])
      ],
      providers: [ComponentService],
      controllers: [ComponentController]
})
export class ComponentModule {}
