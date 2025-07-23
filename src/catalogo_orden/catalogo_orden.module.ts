import { Module } from '@nestjs/common';
import { CatalogoOrdenService } from './catalogo_orden.service';
import { CatalogoOrdenController } from './catalogo_orden.controller';
import { CatalogoOrden } from './entities/catalogo_orden.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([CatalogoOrden])],
  controllers: [CatalogoOrdenController],
  providers: [CatalogoOrdenService],
})
export class CatalogoOrdenModule {}
