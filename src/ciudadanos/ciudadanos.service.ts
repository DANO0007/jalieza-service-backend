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

  return await this.ciudadanosRepository.save({
    name,
    last_name_father,
    last_name_mother,
    birth_date,
    phone,
    marital_status,
    partner: partnerEntity,
  });
}


  async findAll() {
    return await this.ciudadanosRepository.find();
  }

  async findOne(id: number) {
    const ciudadano = await this.ciudadanosRepository.findOneBy({ id });
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
    return await this.ciudadanosRepository.remove(ciudadano);
  }
}
