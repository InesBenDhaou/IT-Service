import { IsString ,IsNotEmpty , Matches} from 'class-validator';

export class CreateLocalisationDto {

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+,[a-zA-Z]+$/, { message: 'Localisation must be in the format "city,country" with only letters.' })
  placeName: string;
}