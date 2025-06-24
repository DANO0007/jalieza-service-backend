import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ username, email, password, role_id }: RegisterDto) {
    const userByEmail = await this.usersService.findOneByName(email);
    if (userByEmail) {
      throw new BadRequestException('Ese correo ya existe');
    }
    return await this.usersService.create({
      username,
      email,
      password: await bcryptjs.hash(password, 10),
      role_id,
    });
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByName(email);
    if (!user) {
      throw new UnauthorizedException('Email does not match');
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      email,
    };
  }
}
