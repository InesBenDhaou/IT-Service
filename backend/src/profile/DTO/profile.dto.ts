import { IsString, IsEmail ,Length ,IsNotEmpty ,Matches } from 'class-validator';

export class ProfileDto {

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
    @Matches(/(.*?)(\.jpg|\.jpeg|\.png|\.gif)$/, {
    message: 'profileImg must be a valid image file (jpg, jpeg, png, gif)',
    })
    profileImg: string;
  
}
