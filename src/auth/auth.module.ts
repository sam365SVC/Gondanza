import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from '../admin/admin.module'; // Importa tu módulo de Admin

@Module({
  imports: [
    AdminModule, // Para poder buscar usuarios en la base de datos
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'CLAVE_SECRETA_MUY_DIFICIL', // Agrégalo a tu .env
      signOptions: { expiresIn: '8h' }, // El token durará 8 horas
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
