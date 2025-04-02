import { Controller, Get, Post, Delete, Param, Body, Res ,UseInterceptors ,UploadedFile,Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './Entity/category.entity';
import { CategoryDTO } from './DTO/category.dto';
import { FileInterceptor } from "@nestjs/platform-express";
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import * as path from 'path';
import { join } from 'path';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id/components')
  async getComponents(@Param('id') id: number) {
    const category = await this.categoryService.findOne(id);
    if (category) {
      return category.components;
    } else {
      return { message: 'Category not found' };
    }
  }

  @Get(':id/categoryName')
  async getCategoryName(@Param('id') id: number) {
    const category = await this.categoryService.findOne(id);
    if (category) {
      return category.name;
    } else {
      return { message: 'Category not found' };
    }
  }

  @Get(':id/component/:idComponent')
  async getComponent(@Param('id') id: number , @Param('idComponent') idComponent: number) {
    const category = await this.categoryService.findOne(id);
    if (category) {
      const component = category.components.find(comp => comp.id === idComponent);
      return {
        categoryName: category.name,
        componentName: component.name,
      };
    } else {
      return { message: 'Category not found' };
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() categoryDTO: CategoryDTO): Promise<CategoryDTO> {
    return this.categoryService.create(categoryDTO);
  }

  @Delete('categoryById/:id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.categoryService.delete(id);
  }

  @Post('uploadCategoryImg')
  @UseInterceptors(FileInterceptor('file' ,{
     storage:diskStorage({
        destination :'./images/categoryimages',
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

  @Put('updateName/:id')
  update(@Param('id') id:number , @Body('newName') newName : string) : Promise<any>{
     return this.categoryService.updateName(id,newName);
  }

  // get the image uploaded by the user
  @Get('categoryImage/:imagename')
  findCategorieImage(@Param('imagename') imagename , @Res() res):Promise<Object>{
    return res.sendFile(join(process.cwd(),'images/categoryimages/' +imagename))
  }

  

  
}
