import { Module } from '@nestjs/common';
import { CiudadanosService } from './ciudadanos.service';
import { CiudadanosController } from './ciudadanos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Ciudadanos} from './entities/ciudadano.entity'

@Module({
  imports:[TypeOrmModule.forFeature([Ciudadanos])],
  controllers: [CiudadanosController],
  providers: [CiudadanosService],
})
export class CiudadanosModule {}
