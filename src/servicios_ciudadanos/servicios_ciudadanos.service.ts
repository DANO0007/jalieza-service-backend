import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiciosCiudadanoDto } from './dto/create-servicios_ciudadano.dto';
import { UpdateServiciosCiudadanoDto } from './dto/update-servicios_ciudadano.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiciosCiudadano } from './entities/servicios_ciudadano.entity';
import { Repository } from 'typeorm';
import { Ciudadanos } from 'src/ciudadanos/entities/ciudadano.entity';

@Injectable()
export class ServiciosCiudadanosService {
  constructor(
    @InjectRepository(ServiciosCiudadano)
    private readonly serviciosRepository: Repository<ServiciosCiudadano>,

    @InjectRepository(Ciudadanos)
    private readonly ciudadanosRepository: Repository<Ciudadanos>,
  ) {}
  
   async create(createDto: CreateServiciosCiudadanoDto) {
    // Validar que exista el ciudadano antes de crear el servicio
    const ciudadano = await this.ciudadanosRepository.findOneBy({
      id: createDto.ciudadano_id,
    });
    if (!ciudadano) {
      throw new BadRequestException(`Ciudadano con id ${createDto.ciudadano_id} no existe`);
    }

    const nuevoServicio = this.serviciosRepository.create({
      citizen: ciudadano,
      service_id: createDto.service_id,
      start_date: new Date(createDto.start_date),
      end_date: new Date(createDto.end_date),
      termination_status: createDto.termination_status,
      observations: createDto.observations || '',
    });

    return await this.serviciosRepository.save(nuevoServicio);
  }s
  findAll() {
    return `This action returns all serviciosCiudadanos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviciosCiudadano`;
  }

 async update(id: number, updateDto: UpdateServiciosCiudadanoDto) {
  const cargo = await this.serviciosRepository.findOne({ where: { id } });
  if (!cargo) {
    throw new NotFoundException(`Cargo con id ${id} no encontrado`);
  }

  Object.assign(cargo, {
    service_id: updateDto.service_id ?? cargo.service_id,
    start_date: updateDto.start_date ? new Date(updateDto.start_date) : cargo.start_date,
    end_date: updateDto.end_date ? new Date(updateDto.end_date) : cargo.end_date,
    termination_status: updateDto.termination_status ?? cargo.termination_status,
    observations: updateDto.observations ?? cargo.observations,
  });

  return this.serviciosRepository.save(cargo);
}


  remove(id: number) {
    return `This action removes a #${id} serviciosCiudadano`;
  }
async obtenerCargosPorCiudadano(ciudadanoId: number) {
  if (isNaN(ciudadanoId)) {
    throw new BadRequestException(`El ID proporcionado no es válido: ${ciudadanoId}`);
  }

  const ciudadano = await this.ciudadanosRepository.findOne({
    where: { id: ciudadanoId },
    relations: ['services'],
  });

  if (!ciudadano) {
    throw new BadRequestException(`Ciudadano con ID ${ciudadanoId} no existe`);
  }

  return ciudadano.services;
}

}
