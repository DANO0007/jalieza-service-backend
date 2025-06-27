import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { Rol } from './entities/rol.entity';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async register(createRolDto: CreateRolDto) {
    const { role_name } = createRolDto;

    const existing = await this.rolRepository.findOneBy({ role_name });
    if (existing) {
      throw new BadRequestException(`Role "${role_name}" already exists`);
    }

    const newRole = this.rolRepository.create({ role_name });
    return await this.rolRepository.save(newRole);
  }

  async findAll() {
    return await this.rolRepository.find();
  }

  async findOne(id: number) {
    const rol = await this.rolRepository.findOneBy({ id });
    if (!rol) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return rol;
  }

  async update(id: number, updateRolDto: UpdateRolDto) {
    const rol = await this.findOne(id);
    Object.assign(rol, updateRolDto);
    return await this.rolRepository.save(rol);
  }

  async remove(id: number) {
    const rol = await this.findOne(id);
    return await this.rolRepository.remove(rol);
  }
}
