import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsString, MinLength } from "class-validator";

export class RegisterDto{
    @Transform(({value})=>value.trim())
    @IsString()
    nombre_usuario: string;

    @Transform(({value})=>value.trim())
    @IsString()
    @MinLength(6)
    contrasena: string;

    @IsNumber()
    id_rol:number;

    @IsBoolean()
    activo:boolean;



}