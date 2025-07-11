import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from 'src/rol/entities/rol.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async register({ username, email, password, role_id }: RegisterDto) {
    const userByEmail = await this.usersService.findOneByName(email);
    if (userByEmail) {
      throw new BadRequestException('Ese correo ya existe');
    }

    const role = await this.rolRepository.findOneBy({ id: role_id });
    if (!role) {
      throw new BadRequestException(`No existe un rol con ID ${role_id}`);
    }

    return await this.usersService.create({
      username,
      email,
      password: await bcryptjs.hash(password, 10),
      role_id,
    });
  }

  async login({ email, password }: LoginDto): Promise<{ token: string }> {
    const user = await this.usersService.findOneByName(email);
    if (!user) {
      throw new UnauthorizedException('Email no registrado');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { email: user.email, sub: user.id };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }
}
