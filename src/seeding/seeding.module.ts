import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedingService } from './seeding.service';
import { SeedingController } from './seeding.controller';
import { Rol } from '../rol/entities/rol.entity';
import { Usuarios } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rol, Usuarios])],
  providers: [SeedingService],
  controllers: [SeedingController],
  exports: [SeedingService],
})
export class SeedingModule {}
