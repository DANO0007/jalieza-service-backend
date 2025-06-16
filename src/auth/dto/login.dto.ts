import { Transform } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class LoginDto{
    
    @Transform(({value})=> value.trim())
    @IsString()
    nombre_usuario: string;

    @Transform(({value})=> value.trim())
    @IsString()
    @MinLength(6)
    contrasena: string;
}