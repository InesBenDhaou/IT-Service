import { Controller, Get, Post, Delete, Param, Body, UseInterceptors,UploadedFile,Res, Put} from '@nestjs/common';
import { ComponentService } from './component.service';
import { Component } from './Entity/component.entity';
import { ComponentDTO, OneComponentDTO } from './DTO/component.dto';
import { FileInterceptor } from "@nestjs/platform-express";
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import * as path from 'path';
import { join } from 'path';


@Controller('components')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Get()
  async findAll(): Promise<Component[]> {
    return this.componentService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id:number): Promise<Component> {
    return this.componentService.findOne(id);
  }

  @Post()
  async create(
    @Body() componentDTO: ComponentDTO,
    @Body('Categoryname') categoryName: string,
  ): Promise<Component> {
    return this.componentService.create(componentDTO, categoryName);
  }

  @Delete('componentById/:id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.componentService.delete(id);
  }

  @Post('uploadComponentImg')
  @UseInterceptors(FileInterceptor('file' ,{
     storage:diskStorage({
        destination :'./images/componentimages',
        filename : (req , file ,cb) => {
          const filename : string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension : string = path.parse(file.originalname).ext;
          cb(null,`${filename}${extension}`)
        }
     })
  }))
  async UploadFile(@UploadedFile() file) :Promise<Object>{
    const filename = path.basename(file.path);
    return {filename};
     
  }

  // get the image uploaded by the user
  
  @Get('componentImage/:imagename')
  findCategorieImage(@Param('imagename') imagename , @Res() res):Promise<Object>{
    return res.sendFile(join(process.cwd(),'images/componentimages/' +imagename))
  }


  @Put(':id/edit')
  async update(@Param('id') id: number, @Body() componentDTO: ComponentDTO): Promise<any> {
    return this.componentService.update(id, componentDTO);
  }
}
