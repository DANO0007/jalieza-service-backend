import { Injectable } from '@nestjs/common';
import { CreateServiciosCiudadanoDto } from './dto/create-servicios_ciudadano.dto';
import { UpdateServiciosCiudadanoDto } from './dto/update-servicios_ciudadano.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiciosCiudadano } from './entities/servicios_ciudadano.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiciosCiudadanosService {

  
  create(createServiciosCiudadanoDto: CreateServiciosCiudadanoDto) {
    return 'This action adds a new serviciosCiudadano';
  }

  findAll() {
    return `This action returns all serviciosCiudadanos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviciosCiudadano`;
  }

  update(id: number, updateServiciosCiudadanoDto: UpdateServiciosCiudadanoDto) {
    return `This action updates a #${id} serviciosCiudadano`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviciosCiudadano`;
  }
}
