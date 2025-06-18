import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ciudadanos } from './entities/ciudadano.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CiudadanosService {
  constructor(
    @InjectRepository(Ciudadanos)
    private readonly ciudadanosRepository: Repository<Ciudadanos>, // 👈 Ya puedes usarlo
  ) {}

  create(createCiudadanoDto: CreateCiudadanoDto) {
    return 'This action adds a new ciudadano';
  }

     async register({
  nombre,
  apellido_paterno,
  apellido_materno,
  fecha_nacimiento,
  genero,
  telefono,
  estado_civil,
  pareja_id
}: CreateCiudadanoDto) {
  return await this.ciudadanosRepository.save({
    nombre,
    apellido_paterno,
    apellido_materno,
    fecha_nacimiento,
    genero,
    telefono,
    estado_civil,
    pareja_id
  });
}

 async findAll() {
    return await this.ciudadanosRepository.find();
  }

  async findOne(id: number) {
    const ciudadano = await this.ciudadanosRepository.findOneBy({ id });
    if (!ciudadano) throw new NotFoundException(`Ciudadano con id ${id} no encontrado`);
    return ciudadano;
  }

  async update(id: number, updateCiudadanoDto: UpdateCiudadanoDto) {
    const ciudadano = await this.findOne(id); // valida que exista
    Object.assign(ciudadano, updateCiudadanoDto);
    return await this.ciudadanosRepository.save(ciudadano);
  }

  async remove(id: number) {
    const ciudadano = await this.findOne(id); // valida que exista
    return await this.ciudadanosRepository.remove(ciudadano);
  }
}
