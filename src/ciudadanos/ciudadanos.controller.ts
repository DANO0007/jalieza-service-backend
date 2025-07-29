import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CiudadanosService } from './ciudadanos.service';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';

@Controller('ciudadanos')
export class CiudadanosController {
  constructor(private readonly ciudadanosService: CiudadanosService) {}

  @Post()
 async create(@Body() createCiudadanoDto: CreateCiudadanoDto) {
    return this.ciudadanosService.register(createCiudadanoDto);
  }

  @Post('register')
  register(@Body() dto: CreateCiudadanoDto) {
  return this.ciudadanosService.register(dto);
}

  @Get()
  findAll() {
    return this.ciudadanosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ciudadanosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCiudadanoDto: UpdateCiudadanoDto) {
    return this.ciudadanosService.update(+id, updateCiudadanoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ciudadanosService.remove(+id);
  }
  @Patch(':id/restaurar')
restaurar(@Param('id', ParseIntPipe) id: number) {
  return this.ciudadanosService.restaurarCiudadano(id);
}

}
