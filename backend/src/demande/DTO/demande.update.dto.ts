import { IsString, IsEmail ,IsOptional,IsEnum,Matches,IsArray } from 'class-validator';
import { StatusDemande } from 'src/interfaces/StatusDemande';
import { Urgence } from 'src/interfaces/Urgence';

export class DemandeUpdateDto {
    @IsString()
    @IsOptional()
    composant?: string;
  
    @IsString()
    @IsOptional()
    categorie?: string;
  
    @IsOptional()
    @IsEnum(Urgence, { message: 'urgence should be : Faible or moyen or faible or critique' })
    urgence?: Urgence;
    
    @IsOptional()
    @IsString()
    commentaire?: string;
  
    @IsOptional()
    @IsEnum(StatusDemande, { message: 'StatusDemande should be : en attente or en cours or accepter or refuser' })
    statusDemande?: StatusDemande;
  
    @IsOptional()
    dateDemande?: Date;

    @IsOptional()
    dateReponse?: Date;
  
    @IsString()
    @IsOptional()
    @Matches(/^[a-zA-Z]+,[a-zA-Z]+$/, { message: 'Localisation must be in the format "city,country" with only letters.' })
    localisation?: string;
  
    @IsOptional()
    @IsString()
    BenificierDemande?:string;

    @IsOptional()
    @IsEmail()
    emailBenificierDemande?: string;

    @IsOptional()
    emailTechnicienAssocie?:string ;

    @IsOptional()
    @IsString()
    technicienAssocie?: string;
    
    @IsOptional()
    @IsString()
    cmtTech?: string;


    @IsOptional()
    @IsString()
    contactManager? :string;

    @IsArray()
    @IsOptional()
    piecesJointes?: string[] = [];
  
}