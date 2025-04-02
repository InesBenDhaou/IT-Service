import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Categorie } from 'src/interfaces/KnowledgeCategory';
import { Type } from 'src/interfaces/Type';

export class KnowledgebaseUpdateDTO {
  
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  lien?: string;

  @IsOptional()
  @IsEnum(Categorie, { message: 'CategorieArticle should be : ....' })
  categorie?: Categorie;

  @IsOptional()
  @IsEnum(Type, { message: 'Type should be : article ou tuto' })
  type?: Type;
}
