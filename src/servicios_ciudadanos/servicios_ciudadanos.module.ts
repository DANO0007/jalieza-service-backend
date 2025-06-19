import { Module } from '@nestjs/common';
import { ServiciosCiudadanosService } from './servicios_ciudadanos.service';
import { ServiciosCiudadanosController } from './servicios_ciudadanos.controller';

@Module({
  controllers: [ServiciosCiudadanosController],
  providers: [ServiciosCiudadanosService],
})
export class ServiciosCiudadanosModule {}
