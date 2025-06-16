import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usersService:UsersService){}

     async register(registerDto:RegisterDto){
        return  await this.usersService.create(registerDto);
        
    }
    login(){
        return 'login';
    }
}
