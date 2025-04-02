import { IsString, IsEmail ,IsOptional ,IsNotEmpty ,IsEnum,Matches, IsArray } from 'class-validator';
import { Urgence } from 'src/interfaces/Urgence';
import { StatusTicket } from 'src/interfaces/StatusTicket';

export class TicketDto {

    @IsString()
    @IsNotEmpty()
    titre: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsNotEmpty()
    @IsEnum(Urgence, { message: 'urgence should be : Faible or moyen or faible or critique' })
    urgence: Urgence;
  
    
    @IsEnum(StatusTicket, { message: 'status should be : en attente or en cours or résolu clôturé' })
    status: StatusTicket;
  
    
    dateCreation: Date;
  
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z]+,[a-zA-Z]+$/, { message: 'Localisation must be in the format "city,country" with only letters.' })
    localisation: string;

    BenificierTicket:string;
    emailBenificierTicket: string;

    
    @IsString()
    contactManager?: string | null;

    @IsArray()
    @IsOptional()
    piecesJointes?: string[] = [];
  
}

export  class TicketPlanificateurDto {
    @IsString()
    @IsNotEmpty()
    titre: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsNotEmpty()
    @IsEnum(Urgence, { message: 'urgence should be : Faible or moyen or faible or critique' })
    urgence: Urgence;
  
    @IsNotEmpty()
    @IsEnum(StatusTicket, { message: 'status should be : en attente or en cours or résolu clôturé' })
    status: StatusTicket;

  
    @IsString()
    @Matches(/^[a-zA-Z]+,[a-zA-Z]+$/, { message: 'Localisation must be in the format "city,country" with only letters.' })
    localisation: string;

    @IsString()
    @IsNotEmpty()
    BenificierTicket:string;

    @IsEmail()
    @IsNotEmpty()
    emailBenificierTicket: string;

    @IsString()
    contactManager?: string | null;

    @IsNotEmpty()
    @IsString()
    technicienAssocie: string;
    
    @IsNotEmpty()
    @IsEmail()
    emailTechnicienAssocie: string;

    @IsArray()
    @IsOptional()
    piecesJointes?: string[] = [];
}
