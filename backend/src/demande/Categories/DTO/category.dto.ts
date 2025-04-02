import { IsString,IsNotEmpty,Matches} from 'class-validator';

export class CategoryDTO {
    @IsNotEmpty()
    @IsString()
    name: string;
 
    @IsString()
    @Matches(/(.*?)(\.jpg|\.jpeg|\.png|\.gif|\.svg)$/, {
    message: 'categoryImg must be a valid image file (jpg, jpeg, png, gif)',
    })
    categoryImg: string;

}