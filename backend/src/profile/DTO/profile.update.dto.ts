import { IsString, IsEmail, Length, IsNotEmpty, Matches, IsOptional } from 'class-validator';

export class UpdateProfileDTO {
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

  @IsString()
  @IsOptional()
  @Matches(/(.*?)(\.jpg|\.jpeg|\.png|\.gif)$/, {
    message: 'profileImg must be a valid image file (jpg, jpeg, png, gif)',
  })
  profileImg?: string;


}

export class UpdateUserNameDto {
  @IsString()
  @IsNotEmpty()
  userName: string;
}

export class UpdateUserLastNameDto {
  @IsString()
  @IsNotEmpty()
  userLastName: string;
}

export class UpdateEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdateNumTelDto {
  @IsString()
  @Length(8, 15)
  numTel: string;
}

export class UpdatePosteDto {
  @IsString()
  @IsNotEmpty()
  poste: string;
}

export class UpdateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  department: string;
}

export class UpdateProfileImgDto {
  @IsString()
  @Matches(/(.*?)(\.jpg|\.jpeg|\.png|\.gif)$/, {
    message: 'profileImg must be a valid image file (jpg, jpeg, png, gif)',
  })
  profileImg: string;
}
