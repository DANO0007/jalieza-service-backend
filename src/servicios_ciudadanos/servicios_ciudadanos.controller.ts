import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiciosCiudadanosService } from './servicios_ciudadanos.service';
import { CreateServiciosCiudadanoDto } from './dto/create-servicios_ciudadano.dto';
import { UpdateServiciosCiudadanoDto } from './dto/update-servicios_ciudadano.dto';

@Controller('servicios-ciudadanos')
export class ServiciosCiudadanosController {
  constructor(private readonly serviciosCiudadanosService: ServiciosCiudadanosService) {}



  @Post()
  create(@Body() createServiciosCiudadanoDto: CreateServiciosCiudadanoDto) {
    return this.serviciosCiudadanosService.create(createServiciosCiudadanoDto);
  }

  @Get()
  findAll() {
    return this.serviciosCiudadanosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviciosCiudadanosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiciosCiudadanoDto: UpdateServiciosCiudadanoDto) {
    return this.serviciosCiudadanosService.update(+id, updateServiciosCiudadanoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviciosCiudadanosService.remove(+id);
  }
}
