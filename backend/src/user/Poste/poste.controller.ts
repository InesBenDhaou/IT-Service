import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { PosteService } from './poste.service';
import { CreatePosteDto } from './poste.dto';
import { Roles } from 'src/decorators/role.decorator';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';


@Controller('postes')
export class PosteController {
  constructor(private readonly posteService: PosteService) {}

  @Roles('planificateur','admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  findAll() {
    return this.posteService.findAll();
  }

  @Roles('planificateur','admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  create(@Body() createPosteDto: CreatePosteDto) {
    return this.posteService.create(createPosteDto);
  }

  @Roles('planificateur','admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.posteService.delete(id);
  }
}
