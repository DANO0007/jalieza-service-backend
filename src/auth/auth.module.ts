import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // IMPORTANTE
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from 'src/rol/entities/rol.entity';
import { RolModule } from 'src/rol/rol.module';

@Module({
  imports: [
    ConfigModule, // IMPORTANTE para que ConfigService funcione
    UsersModule,
    RolModule,
    TypeOrmModule.forFeature([Rol]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa ConfigModule para usar ConfigService aquí
      inject: [ConfigService], // Inyecta ConfigService
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Lee la variable de entorno
        signOptions: { expiresIn: '1d' },
      }),
      global: true, // Hace que JwtModule sea global
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
