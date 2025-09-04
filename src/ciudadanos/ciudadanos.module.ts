import { Module } from '@nestjs/common';
import { CiudadanosService } from './ciudadanos.service';
import { CiudadanosController } from './ciudadanos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ciudadanos } from './entities/ciudadano.entity';
import { MaritalStatusService } from './services/marital-status.service';
import { CiudadanoPuntos } from './entities/ciudadano-puntos.entity';
import { PointsManagementService } from './services/points-management.service';
import { CatalogoOrden } from 'src/catalogo_orden/entities/catalogo_orden.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ciudadanos, CiudadanoPuntos, CatalogoOrden])],
  controllers: [CiudadanosController],
  providers: [CiudadanosService, MaritalStatusService, PointsManagementService],
  exports: [CiudadanosService, PointsManagementService],
})
export class CiudadanosModule {}
