import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UnidadesModule } from './modules/unidades/unidades.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';

import { RolesGuard } from './common/guards/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UnidadesModule,
    UsuariosModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
