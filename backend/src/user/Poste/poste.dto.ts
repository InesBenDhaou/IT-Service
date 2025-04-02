import { IsString, IsInt ,IsNotEmpty} from 'class-validator';

export class CreatePosteDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsInt()
  departmentId : number;
}
