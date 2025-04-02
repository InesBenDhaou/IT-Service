import { IsString, IsEmail ,IsArray ,IsNotEmpty ,IsEnum,Matches, IsOptional } from 'class-validator';
import { StatusDemande } from 'src/interfaces/StatusDemande';
import { Urgence } from 'src/interfaces/Urgence';

export class DemandeDto {

    @IsString()
    @IsNotEmpty()
    composant: string;
  
    @IsString()
    @IsNotEmpty()
    categorie: string;
 
    @IsEnum(StatusDemande, { message: 'StatusDemande should be : en attente or en cours or accepter or refuser' })
    statusDemande: StatusDemande;

    @IsString()
    contactManager :string | null ;

    @IsString()
    @IsNotEmpty()
    BenificierDemande:string;

    @IsString()
    @IsNotEmpty()
    emailBenificierDemande: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z]+,[a-zA-Z]+$/, { message: 'Localisation must be in the format "city,country" with only letters.' })
    localisation: string;
    
    @IsString()
    emailTechnicienAssocie:string ;
    @IsString()
    technicienAssocie: string;
    
    @IsEnum(Urgence)
    @IsNotEmpty()
    urgence : Urgence;

    @IsString()
    @IsOptional()
    commentaire : string ;

    @IsArray()
    @IsOptional()
    piecesJointes?: string[] = [];
}

export  class DemandePlanificateurDto {
    @IsString()
    @IsNotEmpty()
    composant: string;
  
    @IsString()
    @IsNotEmpty()
    categorie: string;
  
    @IsEnum(StatusDemande, { message: 'StatusDemande should be : en attente or en cours or accepter or refuser' })
    statusDemande: StatusDemande;
  
    dateDemande: Date;

    @IsNotEmpty()
    @IsString()
    BenificierDemande:string;

    @IsNotEmpty()
    @IsEmail()
    emailBenificierDemande: string;

    technicienAssocie: string;
    emailTechnicienAssocie: string;
    dateReponse : string ;
    urgence : Urgence ;

    @IsString()
    @IsOptional()
    commentainre : string ;

    @IsString()
    contactManager? :string | null ;

    @IsArray()
    @IsOptional()
    piecesJointes?: string[] = [];
}

