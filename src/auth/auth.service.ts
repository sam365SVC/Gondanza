import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import { loginDto } from './dto/loginDto';
import * as bcrypt from 'bcrypt';
import { ClaimsJWT } from './dto/ClaimsJWT';

@Injectable()
export class AuthService {
  constructor(private jwtService:JwtService, private adminServices:AdminService){}

  async signIn(logindDto: loginDto) {
    const usuario = await this.adminServices.findByEmail(logindDto.email);

    // VALIDACIÓN CLAVE: 
    // Verificamos que exista el usuario Y que tenga el objeto Password
    if (!usuario || !usuario.Password) { 
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Ahora TypeScript sabe que 'usuario.Password' NO es nulo
    const isMatch = await bcrypt.compare(
      logindDto.password, 
      usuario.Password.PasswordHash
    );

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Preparamos los CLAIMS (Payload)
    // --- AQUÍ USAMOS TU CLASE ClaimsJWT ---
    const claims = new ClaimsJWT();
    claims.id = usuario.Id;
    claims.Email = usuario.Email;
    claims.Nombre = usuario.Nombre;

    // Convertimos la instancia de la clase a un objeto plano para JWT
    const payload = { ...claims }; 

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
