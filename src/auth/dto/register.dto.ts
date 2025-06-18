import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsNumber, IsString, MinLength } from "class-validator";

export class RegisterDto{
    @Transform(({value})=>value.trim())
    @IsString()
    usuario: string;
    
    @Transform(({value})=>value.trim())
    @IsEmail()
    email: string;

    @Transform(({value})=>value.trim())
    @IsString()
    @MinLength(6)
    contrasena: string;

    @IsNumber()
    rol_id:number;
}