import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto{
      @Transform(({value})=> value.trim())
    @IsString()
    usuario: string;

    @Transform(({value})=> value.trim())
    @IsEmail()
    email: string;
   

    @Transform(({value})=> value.trim())
    @IsString()
    @MinLength(6)
    contrasena: string;
}