import { Module } from '@nestjs/common';
import { CatalogoOrdenService } from './catalogo_orden.service';
import { CatalogoOrdenController } from './catalogo_orden.controller';

@Module({
  controllers: [CatalogoOrdenController],
  providers: [CatalogoOrdenService],
})
export class CatalogoOrdenModule {}
