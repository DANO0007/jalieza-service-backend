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
    private readonly ciudadanosRepository: Repository<Ciudadanos>,
  ) {}

  create(createCiudadanoDto: CreateCiudadanoDto) {
    return 'This action adds a new ciudadano';
  }

  async register(dto: CreateCiudadanoDto) {
  const {
    name,
    last_name_father,
    last_name_mother,
    birth_date,
    phone,
    marital_status,
    partner: partnerId,
  } = dto;

  let partnerEntity: Ciudadanos = null;

  if (partnerId) {
    partnerEntity = await this.ciudadanosRepository.findOneBy({ id: partnerId });
    if (!partnerEntity) {
      throw new BadRequestException(`Partner with id ${partnerId} not found`);
    }
  }

 const nuevoCiudadano = this.ciudadanosRepository.create({
  name,
  last_name_father,
  last_name_mother,
  birth_date,
  phone,
  marital_status,
  partner: partnerEntity,
});

const saved = await this.ciudadanosRepository.save(nuevoCiudadano);

return {
  message: 'Ciudadano registrado exitosamente',
  data: {
    id: saved.id,
    name: saved.name,
    last_name_father: saved.last_name_father,
    last_name_mother: saved.last_name_mother,
    birth_date: saved.birth_date,
    phone: saved.phone,
    marital_status: saved.marital_status,
    partner: saved.partner?.id || null,
  },
};

}

async findAll() {
  const ciudadanos = await this.ciudadanosRepository.find({
    relations: ['partner', 'services'], // Asegúrate de incluir la relación de cargos
    withDeleted: true,
  });

  return ciudadanos.map(c => ({
    id: c.id,
    name: c.name,
    last_name_father: c.last_name_father,
    last_name_mother: c.last_name_mother,
    birth_date: c.birth_date,
    phone: c.phone,
    marital_status: c.marital_status || null,
    partner: c.partner ? {
      id: c.partner.id,
      name: c.partner.name,
      last_name_father: c.partner.last_name_father,
      last_name_mother: c.partner.last_name_mother,
    } : null,
    visible: !c.deleted_at,                      // ✅ ya reflejando estado activo/inactivo
    cargo: c.services?.length > 0 , // ✅ true si tiene cargos
    candidatoACargo: null // ← ajusta si tienes esta lógica
  }));
}


async findOne(id: number) {
  const ciudadano = await this.ciudadanosRepository.findOne({
    where: { id },
    relations: ['services'] // 👈 Aquí indicas que cargue también los cargos
  });

  if (!ciudadano) {
    throw new NotFoundException(`Citizen with id ${id} not found`);
  }

  return ciudadano;
}

  async update(id: number, updateCiudadanoDto: UpdateCiudadanoDto) {
    const ciudadano = await this.findOne(id);
    Object.assign(ciudadano, updateCiudadanoDto);
    return await this.ciudadanosRepository.save(ciudadano);
  }

  async remove(id: number) {
    const ciudadano = await this.findOne(id);
    return await this.ciudadanosRepository.softRemove(ciudadano);
  }
}
