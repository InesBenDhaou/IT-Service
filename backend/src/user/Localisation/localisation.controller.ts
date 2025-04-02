
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CreateLocalisationDto } from './localisation.dto';
import { LocalisationService } from './localisation.service';

@Controller('localisations')
export class LocalisationController {
  constructor(private readonly localisationService: LocalisationService) {}

  @Get()
  findAll() {
    return this.localisationService.findAll();
  }

  @Post()
  create(@Body() createLocalisationDto: CreateLocalisationDto) {
    return this.localisationService.create(createLocalisationDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.localisationService.delete(id);
  }

}

