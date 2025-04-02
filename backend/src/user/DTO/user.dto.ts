import { IsString, IsEmail ,Length ,IsNotEmpty ,IsEnum,Matches, IsOptional, isString } from 'class-validator';
import { Role } from '../../interfaces/Role';
import {IsNonEmptyString,IsNonEmptyEmail, IsStringAndLength} from '../../utils/validation.custum';

export class UserDto {

    @IsNonEmptyString()
    userName: string;
  
    @IsNonEmptyString()
    userLastName: string;

    @IsNonEmptyString()
    department: string;

    @IsNonEmptyString()
    poste: string;
  
    
    @Matches(/^[a-zA-Z]+,[a-zA-Z]+$/, { message: 'Localisation must be in the format "city,country"' })
    localisation: string;

    @IsNonEmptyEmail()
    email: string;
  
    @IsString()
    contactManager?: string | null;
    
    @IsStringAndLength(8, 15)
    numTel: string;
  
    @IsStringAndLength(8, 20)
    password: string;

    @IsEnum(Role, { message: 'role should be : admin or planificateur or employé or technicien' })
    role: Role;

    @IsString()
    @Matches(/(.*?)(\.jpg|\.jpeg|\.png|\.gif)$/, {
    message: 'profileImg must be a valid image file (jpg, jpeg, png, gif)',
    })
    profileImg: string;

    constructor() {
        this.profileImg = 'default.jpg'; // default value
    }
}
export class UpdateUserDto {

    @IsString()
    @IsOptional()
    userName?: string;
  
    @IsString()
    @IsOptional()
    userLastName?: string;
  
    @IsEmail()
    @IsOptional()
    email?: string;
  
    @IsString()
    @IsOptional()
    @Length(8, 15)
    numTel?: string;
  
    @IsString()
    @IsOptional()
    poste?: string;
  
    @IsString()
    @IsOptional()
    department?: string;
  

    @IsOptional()
    @IsEnum(Role, { message: 'role should be : admin or planificateur or employé or technicien' })
    role?: Role;

    @IsOptional()
    @IsString()
    contactManager? : string | null ;

    @IsString()
    @IsOptional()
    @Matches(/(.*?)(\.jpg|\.jpeg|\.png|\.gif)$/, {
    message: 'profileImg must be a valid image file (jpg, jpeg, png, gif)',
    })
    profileImg?: string;

    @IsString()
    @IsOptional()
    @Matches(/^[a-zA-Z]+,[a-zA-Z]+$/, { message: 'Localisation must be in the format "city,country" with only letters.' })
    localisation?: string;
  
}
export class GetUserDto {

    @IsString()
    @IsNotEmpty()
    userName: string;
  
    @IsString()
    @IsNotEmpty()
    userLastName: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @Length(8, 15)
    numTel: string;
  
    @IsString()
    @IsNotEmpty()
    poste: string;
  
    @IsString()
    @IsNotEmpty()
    department: string;

    @IsString()
    @IsNotEmpty()
    contactManager: string;
    
    @IsString()
    @Matches(/(.*?)(\.jpg|\.jpeg|\.png|\.gif)$/, {
    message: 'profileImg must be a valid image file (jpg, jpeg, png, gif)',
    })
    profileImg: string;

    constructor() {
        this.profileImg = 'default.jpg'; // default value
    }

    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z]+,[a-zA-Z]+$/, { message: 'Localisation must be in the format "city,country" with only letters.' })
    localisation: string;
  
}
