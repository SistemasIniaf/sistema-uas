import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //Ruta pública — devuelve el token JWT y los datos del usuario.
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Requiere token válido — devuelve el perfil del usuario autenticado.
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.me(user);
  }
}
