// token-blacklist.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {

  private blacklist: Set<string> = new Set();

  addToken(token: string) {
    this.blacklist.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }

  getBlacklistedTokens(): string[] {
    return Array.from(this.blacklist);
  }

}
