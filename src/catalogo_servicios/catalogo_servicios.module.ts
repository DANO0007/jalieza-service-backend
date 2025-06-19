import { Module } from '@nestjs/common';
import { CatalogoServiciosService } from './catalogo_servicios.service';
import { CatalogoServiciosController } from './catalogo_servicios.controller';

@Module({
  controllers: [CatalogoServiciosController],
  providers: [CatalogoServiciosService],
})
export class CatalogoServiciosModule {}
