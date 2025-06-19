import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CatalogoServiciosService } from './catalogo_servicios.service';
import { CreateCatalogoServicioDto } from './dto/create-catalogo_servicio.dto';
import { UpdateCatalogoServicioDto } from './dto/update-catalogo_servicio.dto';

@Controller('catalogo-servicios')
export class CatalogoServiciosController {
  constructor(private readonly catalogoServiciosService: CatalogoServiciosService) {}

  @Post()
  create(@Body() createCatalogoServicioDto: CreateCatalogoServicioDto) {
    return this.catalogoServiciosService.create(createCatalogoServicioDto);
  }

  @Get()
  findAll() {
    return this.catalogoServiciosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoServiciosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoServicioDto: UpdateCatalogoServicioDto) {
    return this.catalogoServiciosService.update(+id, updateCatalogoServicioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogoServiciosService.remove(+id);
  }
}
