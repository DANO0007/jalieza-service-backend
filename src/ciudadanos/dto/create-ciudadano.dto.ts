import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";

export class CreateCiudadanoDto {
    @Transform(({value})=>value.trim())
    @IsString()
    nombre:string;

    @Transform(({value})=>value.trim())
    @IsString()
    apellido_paterno:string;

    @Transform(({value})=>value.trim())
    @IsString()
    apellido_materno:string;

    @Type(() => Date)
    @IsDate()
    fecha_nacimiento:Date;

    @Transform(({value})=>value.trim())
    @IsString()
    genero:string;

    @Transform(({value})=>value.trim())
    @IsString()
    telefono:string;
    
    @IsBoolean()
    estado_civil: boolean;

    @IsNumber()
    pareja_id: number;



}
