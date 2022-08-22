import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from './interfaces/token.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(username: string): Token {
    if (!username) {
      throw UnauthorizedException;
    }

    const payload = { username: username };

    return {
      username,
      token: this.jwtService.sign(payload),
    };
  }
}
