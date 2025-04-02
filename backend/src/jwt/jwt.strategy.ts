import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import {PassportStrategy} from '@nestjs/passport';
import { TokenBlacklistService } from "src/Auth/BlackList/token.blacklist";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private tokenBlacklistService: TokenBlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload) {

    const tokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
    const token = tokenExtractor(req);  // Extract the token from the request
    if (this.tokenBlacklistService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token has been revoked');
    }
    return {
      id :payload.id,
      userName: payload.userName,
      userLastName : payload.userLastName,
      role: payload.role,
      profileImg :payload.profileImg,
      email: payload.email,
      numTel: payload.numTel,
      poste: payload.poste,
      localisation : payload.localisation ,
      department: payload.department,
    };
  }
}
 