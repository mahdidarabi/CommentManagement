import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateTokenDTO } from './dto/generate-token.dto';
import { Token } from './interfaces/token.interface';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('token')
  public generateToken(@Body() body: GenerateTokenDTO): Token {
    return this.authService.generateToken(body.userId);
  }
}
