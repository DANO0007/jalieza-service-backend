import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from 'src/rol/entities/rol.entity';
import { RolService } from 'src/rol/rol.service';
import { RolModule } from 'src/rol/rol.module';

@Module({
  imports: [
    UsersModule,
    RolModule,
    TypeOrmModule.forFeature([Rol]), // ✅ Esto va fuera del JwtModule
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
