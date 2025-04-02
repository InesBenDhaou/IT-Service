import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartementDto {
  @IsString()
  @IsNotEmpty()
  nom: string;
}