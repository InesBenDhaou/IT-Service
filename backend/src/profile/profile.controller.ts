import { Body,UploadedFile, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards ,Delete, Param, Put, UseInterceptors, BadRequestException} from "@nestjs/common";
import { JwtAuthGuard } from "src/jwt/jwt.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import * as path from 'path';
import { join } from 'path';
import { UpdateDepartmentDto, UpdateEmailDto, UpdateNumTelDto, UpdatePosteDto, UpdateProfileDTO, UpdateProfileImgDto, UpdateUserLastNameDto, UpdateUserNameDto } from "./DTO/profile.update.dto";
import { ProfileService } from "./profile.service";
import { ProfileDto } from "./DTO/profile.dto";

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}


  //get profile
  @UseGuards(JwtAuthGuard)
  @Get()
  profile(@Req() req, @Res() res) {
    const { role, ...userWithoutRole } = req.user; // Destructure to exclude role
    return res.status(HttpStatus.OK).json(userWithoutRole);
  }

  // upload a profile image
  @UseGuards(JwtAuthGuard)
  @Post('uploadProfileImg')
  @UseInterceptors(FileInterceptor('file' ,{
     storage:diskStorage({
        destination :'./images/profileimages',
        filename : (req , file ,cb) => {
          const filename : string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension : string = path.parse(file.originalname).ext;
          cb(null,`${filename}${extension}`)
        }
     })
  }))
  async UploadFile(@UploadedFile() file) :Promise<Object>{
    const filename = path.basename(file.path);
    return {filename };
     
  }

  // get the image uploaded by the user
  @UseGuards(JwtAuthGuard)
  @Get('profileImage/:imagename')
  findProfileImage(@Param('imagename') imagename , @Res() res):Promise<Object>{
    return res.sendFile(join(process.cwd(),'images/profileimages/' +imagename))
  }

  // Update userName
  @UseGuards(JwtAuthGuard)
  @Put('update/userName')
  async updateUserName(@Req() req, @Body() updateUserNameDto: UpdateUserNameDto, @Res() res) {
    try {
      console.log("id " + req.user.id);
      const updatedUser = await this.profileService.updateUserProfile(req.user.id, updateUserNameDto);
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      throw new BadRequestException('Failed to update userName');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async update(@Param('id') id:number, @Body() updatedto:UpdateProfileDTO):Promise<ProfileDto> {
    try {
       return await this.profileService.update(id,updatedto);
    } catch (error) {
      throw new BadRequestException('Failed to update userLastName');
    }
  }

  // Update userLastName
  @UseGuards(JwtAuthGuard)
  @Put('update/userLastName')
  async updateUserLastName(@Req() req, @Body() updateUserLastNameDto: UpdateUserLastNameDto, @Res() res) {
    try {
      const updatedUser = await this.profileService.updateUserProfile(req.user.id, updateUserLastNameDto);
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      throw new BadRequestException('Failed to update userLastName');
    }
  }

  // Update email
  @UseGuards(JwtAuthGuard)
  @Put('update/email')
  async updateEmail(@Req() req, @Body() updateEmailDto: UpdateEmailDto, @Res() res) {
    try {
      const updatedUser = await this.profileService.updateUserProfile(req.user.id, updateEmailDto);
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      throw new BadRequestException('Failed to update email');
    }
  }

  // Update numTel
  @UseGuards(JwtAuthGuard)
  @Put('update/numTel')
  async updateNumTel(@Req() req, @Body() updateNumTelDto: UpdateNumTelDto, @Res() res) {
    try {
      const updatedUser = await this.profileService.updateUserProfile(req.user.id, updateNumTelDto);
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      throw new BadRequestException('Failed to update numTel');
    }
  }

  // Update poste
  @UseGuards(JwtAuthGuard)
  @Put('update/poste')
  async updatePoste(@Req() req, @Body() updatePosteDto: UpdatePosteDto, @Res() res) {
    try {
      const updatedUser = await this.profileService.updateUserProfile(req.user.id, updatePosteDto);
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      throw new BadRequestException('Failed to update poste');
    }
  }

  // Update department
  @UseGuards(JwtAuthGuard)
  @Put('update/department')
  async updateDepartment(@Req() req, @Body() updateDepartmentDto: UpdateDepartmentDto, @Res() res) {
    try {
      const updatedUser = await this.profileService.updateUserProfile(req.user.id, updateDepartmentDto);
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      throw new BadRequestException('Failed to update department');
    }
  }

  // Update profileImg
  @UseGuards(JwtAuthGuard)
  @Put('update/profileImg')
  async updateProfileImg(@Req() req, @Body() updateProfileImgDto: UpdateProfileImgDto, @Res() res) {
    try {
      const updatedUser = await this.profileService.updateUserProfile(req.user.id, updateProfileImgDto);
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      throw new BadRequestException('Failed to update profileImg');
    }
  }

}

