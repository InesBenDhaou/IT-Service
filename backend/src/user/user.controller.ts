import { Body,UploadedFile, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards ,Delete, Param, Put, UseInterceptors, BadRequestException, Query} from "@nestjs/common";
import { UserService } from "./user.service";
import { Roles } from "src/decorators/role.decorator";
import { JwtAuthGuard } from "src/jwt/jwt.guard";
import { RoleGuard } from "src/guards/role.guard";
import { GetUserDto, UpdateUserDto, UserDto } from "./DTO/user.dto";
import { DeleteResult ,UpdateResult } from "typeorm";
import { Role } from "src/interfaces/Role";


@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UserService) {}
  
   @Roles('admin','planificateur')
   @UseGuards(JwtAuthGuard,RoleGuard)
   @Get()
   async findAll(): Promise<UserDto[]> {
     return this.usersService.findAll();
   }

   @UseGuards(JwtAuthGuard)
   @Get(':id/detailsUser')
   async findOne(@Param('id') id:number): Promise<GetUserDto> {
     return this.usersService.findOne(id);
   }

  @Roles('admin','planificateur')
  @UseGuards(JwtAuthGuard,RoleGuard)
  @Get('employees')
  async getEmployees(): Promise<UserDto[]> {
    return this.usersService.findEmployees(Role.Employe,Role.Admin);
  }

  @Roles('admin','planificateur')
  @UseGuards(JwtAuthGuard)
  @Get('techniciens')
  async getTechniciens(): Promise<UserDto[]> {
    return this.usersService.findUsersByRole(Role.Technicien);
  }

  @Roles('admin','planificateur')
  @UseGuards(JwtAuthGuard)
  @Get('email/:id')
  async getUserMail(@Param('id') id:number ,): Promise<any> {
    return this.usersService.findMail(id);
  }

  @Roles('admin','planificateur')
  @UseGuards(JwtAuthGuard)
  @Get('manageremail/:id')
  async getUserManagerMail(@Param('id') id:number ,): Promise<any> {
    return this.usersService.findManagerMail(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('emails')
  async getAllEmails(): Promise<{ email: string }[]> {
    return this.usersService.findAllEmails();
  }


  
  @UseGuards(JwtAuthGuard)
  @Get('emailsByDepartment')
  async getEmailsByDepartment(@Query('department') department: string): Promise<{ email: string }[]> {
    return this.usersService.findEmailsByDepartment(department);
  }

  
  @Post()
  async create(@Body() user:UserDto): Promise<UserDto> {
    return this.usersService.create(user);
  }

  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
    update(
        @Param('id') id:number ,
        @Body() user : UpdateUserDto
        ) : Promise<UpdateResult> {
        return this.usersService.update(id , user);
  }

  //delete user reserved for admin only
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  async delete(@Param('id') id:number): Promise<DeleteResult> {
    return this.usersService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/localisation')
  async getUserLocalization(@Param('id') id: number): Promise<{ localisation: string }> {
    return this.usersService.findUserLocalization(id);
  }


}

