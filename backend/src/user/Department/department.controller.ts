import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartementDto } from './department.dto';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { Roles } from 'src/decorators/role.decorator';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departementService: DepartmentService) {}
  
  @Roles('planificateur','admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  findAll() {
    return this.departementService.findAll();
  }

  @Roles('planificateur','admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  create(@Body() createDepartementDto: CreateDepartementDto) {
    return this.departementService.create(createDepartementDto);
  }

  @Roles('planificateur','admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.departementService.delete(id);
  }

  @Roles('planificateur','admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id/postes')
  findPostesByDepartementId(@Param('id') id: number) {
    return this.departementService.findPostesByDepartementId(id);
  }
}
