// src/app.module.ts
import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
// Si tienes un módulo separado para Prisma, impórtalo aquí también:
// import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AdminModule, 
    AuthModule,
    // PrismaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}