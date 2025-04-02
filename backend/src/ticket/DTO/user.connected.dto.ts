import { IsString, IsEmail ,Length ,IsNotEmpty ,IsEnum,Matches } from 'class-validator';


export class ConnectedUserDto {

    @IsString()
    @IsNotEmpty()
    userName: string;
  
    @IsString()
    @IsNotEmpty()
    userLastName: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
  
}
