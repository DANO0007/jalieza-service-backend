import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiciosCiudadanosService } from './servicios_ciudadanos.service';
import { ServiciosCiudadanosController } from './servicios_ciudadanos.controller';
import { ServiciosCiudadano } from './entities/servicios_ciudadano.entity';
import { Ciudadanos } from 'src/ciudadanos/entities/ciudadano.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiciosCiudadano, Ciudadanos]),  // Aquí registras los repositorios
  ],
  controllers: [ServiciosCiudadanosController],
  providers: [ServiciosCiudadanosService],
  exports: [ServiciosCiudadanosService],
})
export class ServiciosCiudadanosModule {}
