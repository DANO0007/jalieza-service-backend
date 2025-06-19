import { Injectable } from '@nestjs/common';
import { CreateCatalogoServicioDto } from './dto/create-catalogo_servicio.dto';
import { UpdateCatalogoServicioDto } from './dto/update-catalogo_servicio.dto';

@Injectable()
export class CatalogoServiciosService {
  create(createCatalogoServicioDto: CreateCatalogoServicioDto) {
    return 'This action adds a new catalogoServicio';
  }

  findAll() {
    return `This action returns all catalogoServicios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} catalogoServicio`;
  }

  update(id: number, updateCatalogoServicioDto: UpdateCatalogoServicioDto) {
    return `This action updates a #${id} catalogoServicio`;
  }

  remove(id: number) {
    return `This action removes a #${id} catalogoServicio`;
  }
}
