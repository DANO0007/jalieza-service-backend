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

     async register({usuario,email,contrasena,rol_id}:RegisterDto){
        const user = await this.usersService.findOneByName(usuario)
        if(user){
            throw new BadRequestException(' ese usuario ya existe')
        }
        return  await this.usersService.create({
            usuario,
            email,
            contrasena: await bcryptjs.hash(contrasena,10), 
            rol_id,
            });
        
    }
    async login({email,contrasena}:LoginDto){
         const user = await this.usersService.findOneByName(email)
         if(!user){
            throw new UnauthorizedException('El email no coincide')
         }
          const isPasswordValid=await bcryptjs.compare(contrasena,user.contrasena);
      if(!isPasswordValid){
        throw new UnauthorizedException('contraseña incorrecta');
      }



     
      const payload ={email: user.email}
      const  token  = await this.jwtService.signAsync(payload);
      return {
        token,
        email
      };
    }
}
