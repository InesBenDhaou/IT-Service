import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Categorie } from 'src/interfaces/KnowledgeCategory';
import { Type } from 'src/interfaces/Type';

export class KnowledgeDTO {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  lien: string;

  @IsNotEmpty()
  @IsEnum(Type, { message: 'type should be : article or tuto' })
  type: Type;

  @IsNotEmpty()
  @IsEnum(Categorie, { message: 'CategorieArticle should be : ....' })
  categorie: Categorie;

  @IsOptional()
  isConfirmed: boolean = true;

  @IsNotEmpty()
  @IsNumber()
  createrId: number;

}

export class KnowledgeTechnicienDTO {
  
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  lien: string;

  @IsNotEmpty()
  @IsEnum(Type, { message: 'type should be : article or tuto' })
  type: Type;

  @IsNotEmpty()
  @IsEnum(Categorie, { message: 'CategorieArticle should be : ....' })
  categorie: Categorie;

  @IsOptional()
  isConfirmed: boolean = false;

  @IsNotEmpty()
  @IsNumber()
  createrId: number;

  
}
