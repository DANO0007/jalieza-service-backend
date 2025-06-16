import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto  {
     @IsString()
        @IsOptional()
        nombre_usuario: string;
    
        @IsString()
        @IsOptional()
        contrasena:string;
    
        @IsInt()
        @IsOptional()
        id_rol:number;
    
        @IsBoolean()
        @IsOptional()
        activo: boolean;
    
}
