import { Module } from '@nestjs/common';
import { CiudadanosService } from './ciudadanos.service';
import { CiudadanosController } from './ciudadanos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ciudadanos } from './entities/ciudadano.entity';
import { MaritalStatusService } from './services/marital-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ciudadanos])],
  controllers: [CiudadanosController],
  providers: [CiudadanosService, MaritalStatusService],
})
export class CiudadanosModule {}
