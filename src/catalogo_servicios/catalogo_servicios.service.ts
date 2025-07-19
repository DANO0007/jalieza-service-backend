import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoServicioDto } from './dto/create-catalogo_servicio.dto';
import { UpdateCatalogoServicioDto } from './dto/update-catalogo_servicio.dto';
import { CatalogoServicio } from '../catalogo_servicios/entities/catalogo_servicio.entity';

@Injectable()
export class CatalogoServiciosService {
  constructor(
    @InjectRepository(CatalogoServicio)
    private readonly catalogoServiciosRepository: Repository<CatalogoServicio>,
  ) {}

  async create(createCatalogoServicioDto: CreateCatalogoServicioDto): Promise<CatalogoServicio> {
    const nuevoServicio = this.catalogoServiciosRepository.create(createCatalogoServicioDto);
    return await this.catalogoServiciosRepository.save(nuevoServicio);
  }

  async findAll(): Promise<CatalogoServicio[]> {
    return await this.catalogoServiciosRepository.find();
  }

  async findOne(id: number): Promise<CatalogoServicio> {
    const servicio = await this.catalogoServiciosRepository.findOneBy({ id });
    if (!servicio) {
      throw new NotFoundException(`Servicio con id ${id} no encontrado`);
    }
    return servicio;
  }

  async update(id: number, updateCatalogoServicioDto: UpdateCatalogoServicioDto): Promise<CatalogoServicio> {
    const servicio = await this.findOne(id);
    Object.assign(servicio, updateCatalogoServicioDto);
    return await this.catalogoServiciosRepository.save(servicio);
  }

  async remove(id: number): Promise<void> {
    const resultado = await this.catalogoServiciosRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Servicio con id ${id} no encontrado`);
    }
  }
}
