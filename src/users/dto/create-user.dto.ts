import { IsBoolean, IsEmail, IsInt, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @IsString()
    usuario: string;
    @IsEmail()
    email: string;

    @IsString()
    contrasena:string;

    @IsInt()
    rol_id:number;



}
