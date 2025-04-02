import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/user/Entity/user.entity';
import { TokenBlacklistService } from './BlackList/token.blacklist';
import { TokenBlacklistModule } from './BlackList/token.module';



@Module({
      imports : [
        TypeOrmModule.forFeature([User]),
        TokenBlacklistModule
      ],
      providers: [AuthService],
      controllers: [AuthController]
})
export class AuthModule {}
