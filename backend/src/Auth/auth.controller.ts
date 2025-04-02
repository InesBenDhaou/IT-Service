import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards ,Get } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtAuthGuard } from "src/jwt/jwt.guard";
import { AuthDto } from "./DTO/auth.dto";
import { AuthService } from "./auth.service";



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
   //log in 
   @Post('login')
   @HttpCode(HttpStatus.OK)
   signIn(@Body() signInDto: AuthDto) {
           return this.authService.signIn(signInDto);
   }

   @UseGuards(JwtAuthGuard)
  @Get('userConnected')
  async getConnectedUser (@Req() req) : Promise<any> {
       const { email, userName, userLastName  ,id } = req.user;
       return { email, userName, userLastName , id};
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
    await this.authService.logout(token);
    return { message: 'Logged out successfully' };
   }
}