import { Module } from '@nestjs/common';
import { CatalogoServiciosService } from './catalogo_servicios.service';
import { CatalogoServiciosController } from './catalogo_servicios.controller';
import { CatalogoServicio } from '../catalogo_servicios/entities/catalogo_servicio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
    imports: [TypeOrmModule.forFeature([CatalogoServicio])],

  controllers: [CatalogoServiciosController],
  providers: [CatalogoServiciosService],
})
export class CatalogoServiciosModule {}
