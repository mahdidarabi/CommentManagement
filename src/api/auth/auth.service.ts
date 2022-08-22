import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from './interfaces/token.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(userId: string): Token {
    if (!userId) {
      throw UnauthorizedException;
    }

    const payload = { userId: userId };

    return {
      userId,
      token: this.jwtService.sign(payload),
    };
  }
}
