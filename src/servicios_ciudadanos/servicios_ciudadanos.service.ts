import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiciosCiudadanoDto } from './dto/create-servicios_ciudadano.dto';
import { UpdateServiciosCiudadanoDto } from './dto/update-servicios_ciudadano.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ServiciosCiudadano } from './entities/servicios_ciudadano.entity';
import { Ciudadanos } from 'src/ciudadanos/entities/ciudadano.entity';
import { CatalogoServicio } from 'src/catalogo_servicios/entities/catalogo_servicio.entity';
export enum TerminationStatus {
  completed = 'completado',
  in_progress = 'en_curso',
  unfinished = 'inconcluso'
}

@Injectable()
export class ServiciosCiudadanosService {
  constructor(
    @InjectRepository(ServiciosCiudadano)
    private readonly serviciosRepository: Repository<ServiciosCiudadano>,

    @InjectRepository(Ciudadanos)
    private readonly ciudadanosRepository: Repository<Ciudadanos>,

    @InjectRepository(CatalogoServicio)
    private readonly catalogoServicioRepository: Repository<CatalogoServicio>,
  ) {}

// ✅ CREAR NUEVO SERVICIO
async create(createDto: CreateServiciosCiudadanoDto) {
  const ciudadano = await this.ciudadanosRepository.findOneBy({
    id: createDto.ciudadano_id,
  });

  if (!ciudadano) {
    throw new BadRequestException(
      `Ciudadano con id ${createDto.ciudadano_id} no existe`,
    );
  }

  const catalogo = await this.catalogoServicioRepository.findOneBy({
    id: createDto.service_id,
  });

  if (!catalogo) {
    throw new BadRequestException(
      `Servicio con id ${createDto.service_id} no existe`,
    );
  }

  const startDate = new Date(createDto.start_date);
  const endDate = new Date(createDto.end_date);

  // ⚙️ Cálculo del periodo de descanso
  let restPeriodEnd: Date | null = null;
  if (createDto.termination_status === TerminationStatus.completed) {
    restPeriodEnd = new Date(endDate);
    restPeriodEnd.setFullYear(restPeriodEnd.getFullYear() + 2); // +2 años
  }

  const nuevoServicio = this.serviciosRepository.create({
    citizen: ciudadano,
    catalogoServicio: catalogo,
    start_date: startDate,
    end_date: endDate,
    termination_status: createDto.termination_status,
    observations: createDto.observations || '',
    rest_period_end: restPeriodEnd, // ✅ Aquí se asigna si aplica
  });

  return await this.serviciosRepository.save(nuevoServicio);
}


  // 🟡 OBTENER TODOS (opcional, aún sin implementar)
  findAll() {
    return `This action returns all serviciosCiudadanos`;
  }

  // 🟡 OBTENER UNO POR ID (opcional)
  findOne(id: number) {
    return `This action returns a #${id} serviciosCiudadano`;
  }

  // ✅ ACTUALIZAR SERVICIO
  async update(id: number, updateDto: UpdateServiciosCiudadanoDto) {
  const cargo = await this.serviciosRepository.findOne({
    where: { id },
    relations: ['catalogoServicio'],
  });

  if (!cargo) {
    throw new NotFoundException(`Cargo con id ${id} no encontrado`);
  }

  // Actualiza la relación si cambió el servicio
  if (
    updateDto.service_id &&
    (!cargo.catalogoServicio || cargo.catalogoServicio.id !== updateDto.service_id)
  ) {
    const nuevoServicio = await this.catalogoServicioRepository.findOneBy({
      id: updateDto.service_id,
    });

    if (!nuevoServicio) {
      throw new NotFoundException(
        `Servicio con id ${updateDto.service_id} no encontrado`,
      );
    }

    cargo.catalogoServicio = nuevoServicio;
  }

  // Actualiza campos básicos
  cargo.start_date = updateDto.start_date
    ? new Date(updateDto.start_date)
    : cargo.start_date;

  cargo.end_date = updateDto.end_date
    ? new Date(updateDto.end_date)
    : cargo.end_date;

  const nuevoStatus = updateDto.termination_status ?? cargo.termination_status;
  cargo.termination_status = nuevoStatus;

  cargo.observations = updateDto.observations ?? cargo.observations;

  // 🚀 Lógica para calcular rest_period_end
  if (nuevoStatus === 'completado' && cargo.end_date) {
    const finDescanso = new Date(cargo.end_date);
    finDescanso.setFullYear(finDescanso.getFullYear() + 2);
    cargo.rest_period_end = finDescanso;
  } else {
    // Si cambia a otro status, anulamos el descanso
    cargo.rest_period_end = null;
  }

  await this.serviciosRepository.save(cargo);
  return { message: 'Actualización exitosa' };
}


  // 🗑️ ELIMINAR (placeholder)
  remove(id: number) {
    return `This action removes a #${id} serviciosCiudadano`;
  }

  // ✅ OBTENER TODOS LOS CARGOS DE UN CIUDADANO
  async obtenerCargosPorCiudadano(ciudadanoId: number) {
    if (isNaN(ciudadanoId)) {
      throw new BadRequestException(
        `El ID proporcionado no es válido: ${ciudadanoId}`,
      );
    }

    const ciudadano = await this.ciudadanosRepository.findOne({
      where: { id: ciudadanoId },
      relations: ['services', 'services.catalogoServicio'],
    });

    if (!ciudadano) {
      throw new BadRequestException(
        `Ciudadano con ID ${ciudadanoId} no existe`,
      );
    }

    return ciudadano.services;
  }
}
