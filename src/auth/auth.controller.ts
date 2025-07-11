import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(
        
        private readonly authService: AuthService
    ){ }
    
    @Post('register')
    register(
        @Body()
        registerDto: RegisterDto

    ){
        console.log(registerDto)
        return this.authService.register(registerDto)
    }

  

 @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.login(loginDto);
    
    // Establecer cookie con el token
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true si usas HTTPS en producción
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 1, // 1 hora
    });

    return { message: 'Inicio de sesión exitoso' };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Sesión cerrada' };
  }


    
    @Get('profile')
    @UseGuards(AuthGuard)
    profile(){
        return 'profile';
    }
}
