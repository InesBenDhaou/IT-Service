import { IsString, IsEmail ,IsOptional,IsEnum,Matches ,IsNotEmpty} from 'class-validator';
import { StatusDemande } from 'src/interfaces/StatusDemande';
import { Urgence } from 'src/interfaces/Urgence';

export class GetDemandeDto {

    @IsString()
    @IsNotEmpty()
    composant: string;
  
    @IsString()
    @IsNotEmpty()
    categorie: string;
  
    @IsNotEmpty()
    @IsEnum(Urgence, { message: 'urgence should be : Faible or moyen or faible or critique' })
    urgence: Urgence;

    @IsString()
    commentaire?: string;
  
    @IsNotEmpty()
    @IsEnum(StatusDemande, { message: 'StatusDemande should be : en attente or en cours or accepter or refuser' })
    statusDemande: StatusDemande;
  
    @IsNotEmpty()
    dateDemande?: Date;

    @IsNotEmpty()
    dateReponse?: Date;
  
    
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z]+,[a-zA-Z]+$/, { message: 'Localisation must be in the format "city,country" with only letters.' })
    localisation?: string;
  
    @IsNotEmpty()
    @IsString()
    BenificierDemande?:string;

    @IsNotEmpty()
    @IsEmail()
    emailBenificierDemande?: string;

    @IsNotEmpty()
    emailTechnicienAssocie?:string ;

    @IsNotEmpty()
    @IsString()
    technicienAssocie?: string;
    
    @IsNotEmpty()
    @IsString()
    cmtTech?: string;


    @IsString()
    contactManager? :string | null;
  
}
