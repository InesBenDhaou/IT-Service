import { Module } from '@nestjs/common';
import { TokenBlacklistService } from './token.blacklist';


@Module({
  providers: [TokenBlacklistService],
  exports: [TokenBlacklistService],
})
export class TokenBlacklistModule {}
