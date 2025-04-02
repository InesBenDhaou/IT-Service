import { IsString, IsEmail ,IsArray ,IsNotEmpty ,IsEnum,Matches, IsOptional, IsDate } from 'class-validator';
import { Urgence } from 'src/interfaces/Urgence';
import { StatusTicket } from 'src/interfaces/StatusTicket';

export class UpdateTicketDto {

    @IsString()
    @IsOptional()
    titre?: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsOptional()
    @IsEnum(Urgence, { message: 'urgence should be : Faible or moyen or faible or critique' })
    urgence?: Urgence;
  
    @IsOptional()
    @IsEnum(StatusTicket, { message: 'status should be : en attente or en cours or résolu clôturé' })
    status?: StatusTicket;
  
    @IsOptional()
    dateCreation?: Date;

    @IsOptional()
    dateResolution?: Date;
  
    @IsString()
    @IsOptional()
    @Matches(/^[a-zA-Z]+,[a-zA-Z]+$/, { message: 'Localisation must be in the format "city,country" with only letters.' })
    localisation?: string;
  
    @IsOptional()
    @IsString()
    BenificierTicket?:string;

    @IsOptional()
    @IsEmail()
    emailBenificierTicket?: string;

    @IsOptional()
    @IsString()
    technicienAssocie?: string;

    @IsOptional()
    @IsEmail()
    emailTechnicienAssocie?: string;
    
    @IsOptional()
    @IsString()
    cmtTech?: string;

    @IsOptional()
    @IsString()
    feedBack?: string;

    @IsOptional()
    @IsString()
    cmtEmp?: string;

    @IsArray()
    @IsOptional()
    piecesJointes?: string[] = [];
  
}

