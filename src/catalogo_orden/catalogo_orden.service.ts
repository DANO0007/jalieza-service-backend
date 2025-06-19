import { Injectable } from '@nestjs/common';
import { CreateCatalogoOrdenDto } from './dto/create-catalogo_orden.dto';
import { UpdateCatalogoOrdenDto } from './dto/update-catalogo_orden.dto';

@Injectable()
export class CatalogoOrdenService {
  create(createCatalogoOrdenDto: CreateCatalogoOrdenDto) {
    return 'This action adds a new catalogoOrden';
  }

  findAll() {
    return `This action returns all catalogoOrden`;
  }

  findOne(id: number) {
    return `This action returns a #${id} catalogoOrden`;
  }

  update(id: number, updateCatalogoOrdenDto: UpdateCatalogoOrdenDto) {
    return `This action updates a #${id} catalogoOrden`;
  }

  remove(id: number) {
    return `This action removes a #${id} catalogoOrden`;
  }
}
