import { BadRequestException, Injectable } from '@nestjs/common';
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

  update(id: number, updateServiciosCiudadanoDto: UpdateServiciosCiudadanoDto) {
    return `This action updates a #${id} serviciosCiudadano`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviciosCiudadano`;
  }

  async obtenerCargosPorCiudadano(ciudadanoId: number) {
  const ciudadano = await this.ciudadanosRepository.findOne({
    where: { id: ciudadanoId },
    relations: ['services'], // Asegúrate de que 'services' es el nombre de la relación
  });

  if (!ciudadano) {
    throw new BadRequestException(`Ciudadano con ID ${ciudadanoId} no existe`);
  }

  return ciudadano.services;
}

}
