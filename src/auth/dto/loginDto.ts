import { IsEmail, MaxLength, MinLength} from "class-validator"


export class loginDto{
    @MaxLength(100,{message:"el correo electronico no debe tener mas de 100 caracteres"})
    @IsEmail({},{message:"debe ser un correo electronico valido"})
    email:string
    @MinLength(8,{message:"El password debe tener minimo 8 caracteres"})
    password:string    
}
