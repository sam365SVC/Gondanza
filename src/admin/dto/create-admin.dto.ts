import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
const formatearNombre = ({ value }: { value: string }) => {
  if (typeof value !== 'string') return value;
  
  return value
    .trim() // 1. Quita espacios al inicio y al final
    .replace(/\s+/g, ' ') // 2. Convierte múltiples espacios en uno solo
    .toLowerCase() // 3. Pasa todo a minúsculas ("samuel denis villca castro")
    .split(' ') // 4. Separa por palabras
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)) // 5. Capitaliza la primera letra
    .join(' '); // 6. Vuelve a unir todo
};


export class CreateAdminDto {
    @Transform(formatearNombre)// Aplica la corrección antes de validar
    @IsString({message:"error el nombre debe ser un texto"})
    @IsNotEmpty({message:"error el nombre es obligatorio"})
    @MaxLength(50,{message:"error el nombre no puede superar 50 caracteres"})
    Nombre:string
    @Transform(formatearNombre)
    @IsString({message:"error el apellido debe ser un texto"})
    @IsNotEmpty({message:"error el apellido es obligatorio"})
    @MaxLength(50,{message:"error el apellido no puede superar 50 caracteres"})
    Apellido:string
    @IsEmail({},{message:"debe ser un correo electronico valido"})
    @IsString({message:"error el email debe ser un texto"})
    @IsNotEmpty({message:"error el email es obligatorio"})
    @MaxLength(100,{message:"error el email no puede superar 50 caracteres"})
    Email:string
    @IsString({ message: 'La contraseña debe ser un texto.' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @MinLength(8,{message:"La contraseña debe tener minimo 50 caracteres"})
    Password:string
}
