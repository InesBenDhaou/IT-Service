import { IsString,IsNotEmpty,Matches} from 'class-validator';

export class ComponentDTO {
    @IsString()
    @IsNotEmpty()
    name: string;
 
    @IsString()
    @Matches(/(.*?)(\.jpg|\.jpeg|\.png|\.gif|\.svg)$/, {
    message: 'componentImg must be a valid image file (jpg, jpeg, png, gif)',
    })
    componentImg: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export class OneComponentDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    nameCategory: string;
 
    
}