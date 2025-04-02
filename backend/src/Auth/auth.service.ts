import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { sign } from "jsonwebtoken";
import { AuthDto } from "./DTO/auth.dto";
import { TokenBlacklistService } from "src/Auth/BlackList/token.blacklist";
import { Repository } from "typeorm";
import { User } from "src/user/Entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private tokenBlacklistService: TokenBlacklistService, 

  ) {}
async signIn(user : AuthDto): Promise<any> {
     
    const IsValiduser = await this.userRepository.findOne({where:{"email":user.email}});
    if (!IsValiduser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(user.password, IsValiduser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const token = sign({ ...IsValiduser }, process.env.JWT_SECRET);
    return { token, IsValiduser };

  } 

  async logout(token: string): Promise<void> {
      this.tokenBlacklistService.addToken(token);
  }
}