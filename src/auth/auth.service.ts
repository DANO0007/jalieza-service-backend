import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService:UsersService,
        private readonly jwtService:JwtService,
    ){}

     async register({nombre_usuario,contrasena,id_rol,activo}:RegisterDto){
        const user = await this.usersService.findOneByName(nombre_usuario)
        if(user){
            throw new BadRequestException(' ese usuario ya existe')
        }
        return  await this.usersService.create({
            nombre_usuario,
            contrasena: await bcryptjs.hash(contrasena,10), 
            id_rol,
            activo});
        
    }
    async login({nombre_usuario,contrasena}:LoginDto){
         const user = await this.usersService.findOneByName(nombre_usuario)
         if(!user){
            throw new UnauthorizedException('El nombre no coincide')
         }
          const isPasswordValid=await bcryptjs.compare(contrasena,user.contrasena);
      if(!isPasswordValid){
        throw new UnauthorizedException('contraseña incorrecta');
      }


         if (!user.activo) {
            throw new UnauthorizedException('El usuario está inactivo');
          }

     
      const payload ={nombre_usuario: user.nombre_usuario}
      const  token  = await this.jwtService.signAsync(payload);
      return {
        token,
        nombre_usuario
      };
    }
}
