import { IsNonEmptyEmail, IsStringAndLength } from 'src/utils/validation.custum';

export class AuthDto {

    @IsNonEmptyEmail()
    email: string;
  
    @IsStringAndLength(8, 20)
    password: string;
}
