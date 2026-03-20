import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly prisma:PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    try {
      // 1. Encriptamos la contraseña por seguridad
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createAdminDto.Password, saltRounds);

      // 2. Transacción Automática (Nested Write)
      const nuevoAdmin = await this.prisma.usuario.create({
        data: {
          Nombre: createAdminDto.Nombre,
          Apellido: createAdminDto.Apellido,
          Email: createAdminDto.Email,
          
          Password: {
            create: {
              PasswordHash: hashedPassword,
            },
          },
        },
        // ❌ Ya no ponemos "include: { Password: true }" aquí
      });

      // ❌ Ya no necesitamos el "delete" porque Prisma nunca trajo la contraseña

      return {
        mensaje: 'Administrador creado con éxito',
        admin: nuevoAdmin, // Esto devuelve el usuario limpio
      };

    } catch (error) {
      // 3. Capturamos errores específicos
      if (error.code === 'P2002') {
        throw new BadRequestException('El correo electrónico ya está registrado en el sistema.');
      }

      console.error('Error al crear admin:', error);
      throw new InternalServerErrorException('Ocurrió un error inesperado al crear el administrador.');
    }
  }

  async findAll(page: number = 1) {
    // 1. Leemos el límite desde el .env (y le ponemos 10 por si alguien borra la variable)
    // Usamos parseInt porque todo lo que viene del .env es texto (String)
    const limit = parseInt(process.env.DEFAULT_PAGE_SIZE || '10', 10);

    // 2. Calculamos cuántos registros debemos "saltar" (skip)
    // Ejemplo: Si estoy en la página 1 -> salto 0. Si estoy en la página 2 -> salto 10.
    const skip = (page - 1) * limit;

    // 3. Ejecutamos dos consultas al mismo tiempo para que sea rapidísimo:
    // - Buscamos los usuarios
    // - Contamos cuántos usuarios hay en total en la base de datos
    const [admins, totalRegistros] = await Promise.all([
      this.prisma.usuario.findMany({
        skip: skip,
        take: limit,
        // Opcional: Podemos ordenar para que los más nuevos salgan primero
        orderBy: { Id: 'desc' }
      }),
      this.prisma.usuario.count(),
    ]);

    // 4. Calculamos cuántas páginas hay en total
    const totalPages = Math.ceil(totalRegistros / limit);

    // 5. Devolvemos los datos junto con la "meta-información" de la paginación
    return {
      data: admins, // La lista de usuarios de esta página
      meta: {
        totalRegistros,   // Cuántos usuarios hay en total
        paginaActual: page, // En qué página estamos
        limitePorPagina: limit, // Cuántos trajimos
        totalPaginas: totalPages, // Cuántas páginas hay en total
      },
    };
  }

  async findOne(id: number) {
    const admin = await this.prisma.usuario.findUnique({
      where:{
        Id:id
      },
    });

    // 2. Si Prisma devuelve null (no lo encontró), lanzamos un error 404
    if (!admin) {
      throw new NotFoundException(`El administrador con el ID ${id} no fue encontrado.`);
    }

    // 3. Si lo encuentra, lo devolvemos limpio
    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      // Al haber limpiado el DTO, updateAdminDto solo contiene 
      // lo que sí se puede editar (Nombre, Apellido, etc.)
      const adminActualizado = await this.prisma.usuario.update({
        where: { Id: id },
        data: updateAdminDto, // Pasamos los datos directamente
      });

      return {
        mensaje: 'Perfil actualizado con éxito',
        admin: adminActualizado,
      };
      
    } catch (error) {
      // P2025: El ID no existe en la base de datos
      if (error.code === 'P2025') {
        throw new NotFoundException(`No se encontró el administrador con ID ${id}`);
      }
      
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar el administrador');
    }
  }
  async findByEmail(email:string)
  {
    const password= await this.prisma.usuario.findUnique({
      where:{
        Email:email
      },
      include:{
        Password:true
      }
    });
    if (!password||!password.Password) {
      return null;
    }
    return password;
  }
}
