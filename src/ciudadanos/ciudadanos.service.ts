import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';
import { CheckDuplicateCiudadanoDto } from './dto/check-duplicate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ciudadanos } from './entities/ciudadano.entity';
import { Repository } from 'typeorm';
import {
  MaritalStatus,
  MaritalStatusLabels,
} from './enums/marital-status.enum';

@Injectable()
export class CiudadanosService {
  constructor(
    @InjectRepository(Ciudadanos)
    private readonly ciudadanosRepository: Repository<Ciudadanos>,
  ) {}

  async checkDuplicate(checkDuplicateDto: CheckDuplicateCiudadanoDto) {
    const { name, last_name_father, last_name_mother } = checkDuplicateDto;

    const existingCiudadano = await this.ciudadanosRepository.findOne({
      where: {
        name: name.trim(),
        last_name_father: last_name_father.trim(),
        ...(last_name_mother && { last_name_mother: last_name_mother.trim() }),
      },
      withDeleted: false,
    });

    return {
      isDuplicate: !!existingCiudadano,
      existingCiudadano: existingCiudadano
        ? {
            id: existingCiudadano.id,
            name: existingCiudadano.name,
            last_name_father: existingCiudadano.last_name_father,
            last_name_mother: existingCiudadano.last_name_mother,
            marital_status: existingCiudadano.marital_status,
            birth_date: existingCiudadano.birth_date,
            age: this.calculateAge(existingCiudadano.birth_date),
          }
        : null,
    };
  }

  getMaritalStatuses() {
    return Object.values(MaritalStatus).map((status) => ({
      id: status,
      label: MaritalStatusLabels[status],
    }));
  }

  async searchCiudadanos(query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const ciudadanos = await this.ciudadanosRepository
      .createQueryBuilder('ciudadano')
      .where(
        'ciudadano.name ILIKE :query OR ciudadano.last_name_father ILIKE :query OR ciudadano.last_name_mother ILIKE :query',
        { query: `%${query.trim()}%` },
      )
      .andWhere('ciudadano.deleted_at IS NULL')
      .select([
        'ciudadano.id',
        'ciudadano.name',
        'ciudadano.last_name_father',
        'ciudadano.last_name_mother',
        'ciudadano.marital_status',
      ])
      .limit(10)
      .getMany();

    return ciudadanos.map((c) => ({
      id: c.id,
      name: c.name,
      last_name_father: c.last_name_father,
      last_name_mother: c.last_name_mother,
      marital_status: c.marital_status,
      birth_date: c.birth_date,
      age: this.calculateAge(c.birth_date),
      full_name:
        `${c.name} ${c.last_name_father} ${c.last_name_mother || ''}`.trim(),
    }));
  }

  create(createCiudadanoDto: CreateCiudadanoDto) {
    return 'This action adds a new ciudadano';
  }

  async register(dto: CreateCiudadanoDto) {
    const {
      name,
      last_name_father,
      last_name_mother,
      comment,
      birth_date,
      phone,
      marital_status,
      partner: partnerId,
    } = dto;

    // Verificar duplicados antes de registrar
    const duplicateCheck = await this.checkDuplicate({
      name,
      last_name_father,
      last_name_mother: last_name_mother || '',
    });

    if (duplicateCheck.isDuplicate) {
      throw new ConflictException({
        message: 'Ya existe un ciudadano con estos datos',
        existingCiudadano: duplicateCheck.existingCiudadano,
      });
    }

    // Validar que si está casado, debe tener pareja
    if (marital_status === MaritalStatus.CASADO && !partnerId) {
      throw new BadRequestException(
        'Si el estado civil es casado, debe especificar una pareja',
      );
    }

    let partnerEntity: Ciudadanos = null;

    if (partnerId) {
      partnerEntity = await this.ciudadanosRepository.findOne({
        where: { id: partnerId },
        relations: ['partner'],
      });
      if (!partnerEntity) {
        throw new BadRequestException(`Partner with id ${partnerId} not found`);
      }

      // Verificar que la pareja no esté ya casada con otra persona
      if (
        partnerEntity.marital_status === MaritalStatus.CASADO &&
        partnerEntity.partner
      ) {
        throw new BadRequestException(
          `La persona seleccionada ya está casada con ${partnerEntity.partner.name} ${partnerEntity.partner.last_name_father}`,
        );
      }
    }

    let localDate: Date | null = null;

    if (birth_date) {
      localDate = new Date(birth_date);
      if (isNaN(localDate.getTime())) {
        // Fecha inválida, la ignoramos
        localDate = null;
      } else {
        // Ajuste para desfase de zona horaria
        localDate.setMinutes(
          localDate.getMinutes() + localDate.getTimezoneOffset(),
        );
      }
    }

    const nuevoCiudadano = this.ciudadanosRepository.create({
      name,
      last_name_father,
      last_name_mother,
      comment,
      birth_date: localDate, // null si no hay fecha válida
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
        comment: saved.comment,
        birth_date: saved.birth_date,
        age: this.calculateAge(saved.birth_date),
        phone: saved.phone,
        marital_status: saved.marital_status,
        partner: saved.partner
          ? {
              id: saved.partner.id,
              name: saved.partner.name,
              last_name_father: saved.partner.last_name_father,
              last_name_mother: saved.partner.last_name_mother,
            }
          : null,
      },
    };
  }

  async findAll(includeDeleted: boolean = false) {
    const ciudadanos = await this.ciudadanosRepository.find({
      relations: ['partner', 'services', 'services.catalogoServicio'],
      withDeleted: includeDeleted,
    });

    return ciudadanos.map((c) => ({
      id: c.id,
      name: c.name,
      last_name_father: c.last_name_father,
      last_name_mother: c.last_name_mother,
      comment: c.comment,
      birth_date: c.birth_date,
      age: this.calculateAge(c.birth_date),
      phone: c.phone,
      marital_status: c.marital_status || null,
      partner: c.partner
        ? {
            id: c.partner.id,
            name: c.partner.name,
            last_name_father: c.partner.last_name_father,
            last_name_mother: c.partner.last_name_mother,
          }
        : null,
      ...(includeDeleted && {
        visible: !c.deleted_at,
        deleted_at: c.deleted_at,
      }),
      services:
        c.services?.map((s) => ({
          id: s.id,
          service_name: s.catalogoServicio?.service_name || 'Sin nombre',
          start_date: s.start_date,
          end_date: s.end_date,
          termination_status: s.termination_status,
          observations: s.observations,
        })) || [],
      candidatoACargo: null,
    }));
  }

  async findOne(id: number, includeDeleted: boolean = false) {
    const ciudadano = await this.ciudadanosRepository.findOne({
      where: { id },
      relations: ['partner', 'services', 'services.catalogoServicio'],
      withDeleted: includeDeleted,
    });

    if (!ciudadano) {
      throw new NotFoundException(`Citizen with id ${id} not found`);
    }

    return {
      id: ciudadano.id,
      name: ciudadano.name,
      last_name_father: ciudadano.last_name_father,
      last_name_mother: ciudadano.last_name_mother,
      comment: ciudadano.comment,
      birth_date: ciudadano.birth_date,
      age: this.calculateAge(ciudadano.birth_date),
      phone: ciudadano.phone,
      ...(includeDeleted && { deleted_at: ciudadano.deleted_at }),
      marital_status: ciudadano.marital_status || null,
      partner: ciudadano.partner
        ? {
            id: ciudadano.partner.id,
            name: ciudadano.partner.name,
            last_name_father: ciudadano.partner.last_name_father,
            last_name_mother: ciudadano.partner.last_name_mother,
          }
        : null,
      services:
        ciudadano.services?.map((s) => ({
          id: s.id,
          service_name: s.catalogoServicio?.service_name || 'Sin nombre',
          start_date: s.start_date,
          end_date: s.end_date,
          termination_status: s.termination_status,
          observations: s.observations,
        })) || [],
    };
  }

  async update(id: number, updateCiudadanoDto: UpdateCiudadanoDto) {
    const ciudadano = await this.ciudadanosRepository.findOne({
      where: { id },
      relations: ['partner'],
      withDeleted: false,
    });

    if (!ciudadano) {
      throw new NotFoundException(`Citizen with id ${id} not found`);
    }

    const {
      marital_status: newMaritalStatus,
      partner: newPartnerId,
      ...otherFields
    } = updateCiudadanoDto;

    // Manejar cambios de estado civil
    if (newMaritalStatus !== undefined) {
      await this.handleMaritalStatusChange(
        ciudadano,
        newMaritalStatus,
        newPartnerId,
      );
    }

    // Actualizar otros campos
    Object.assign(ciudadano, otherFields);

    const saved = await this.ciudadanosRepository.save(ciudadano);

    return {
      message: 'Ciudadano actualizado exitosamente',
      data: {
        id: saved.id,
        name: saved.name,
        last_name_father: saved.last_name_father,
        last_name_mother: saved.last_name_mother,
        comment: saved.comment,
        birth_date: saved.birth_date,
        age: this.calculateAge(saved.birth_date),
        phone: saved.phone,
        marital_status: saved.marital_status,
        partner: saved.partner
          ? {
              id: saved.partner.id,
              name: saved.partner.name,
              last_name_father: saved.partner.last_name_father,
              last_name_mother: saved.partner.last_name_mother,
            }
          : null,
      },
    };
  }

  async remove(id: number) {
    const ciudadano = await this.findOne(id, false);
    return await this.ciudadanosRepository.softRemove(ciudadano);
  }
  async restaurarCiudadano(id: number) {
    return await this.ciudadanosRepository.restore(id);
  }

  private calculateAge(birthDate: Date): number | null {
    if (!birthDate) return null;

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  private async handleMaritalStatusChange(
    ciudadano: Ciudadanos,
    newMaritalStatus: MaritalStatus,
    newPartnerId?: number,
  ) {
    const currentMaritalStatus = ciudadano.marital_status;

    // Si no hay cambio de estado civil, no hacer nada
    if (currentMaritalStatus === newMaritalStatus) {
      return;
    }

    // Caso 1: Cambio de SOLTERO a CASADO
    if (
      currentMaritalStatus === MaritalStatus.SOLTERO &&
      newMaritalStatus === MaritalStatus.CASADO
    ) {
      if (!newPartnerId) {
        throw new BadRequestException(
          'Si cambia a casado, debe especificar una pareja',
        );
      }

      // Buscar la pareja
      const partner = await this.ciudadanosRepository.findOneBy({
        id: newPartnerId,
      });
      if (!partner) {
        throw new BadRequestException(
          `Pareja con id ${newPartnerId} no encontrada`,
        );
      }

      // Verificar que la pareja no sea el mismo ciudadano
      if (partner.id === ciudadano.id) {
        throw new BadRequestException(
          'Un ciudadano no puede ser pareja de sí mismo',
        );
      }

      // Verificar que la pareja no esté ya casada con otra persona
      if (
        partner.marital_status === MaritalStatus.CASADO &&
        partner.partner &&
        partner.partner.id !== ciudadano.id
      ) {
        throw new BadRequestException(
          `La persona seleccionada ya está casada con ${partner.partner.name} ${partner.partner.last_name_father}`,
        );
      }

      // Establecer la relación bidireccional
      ciudadano.marital_status = MaritalStatus.CASADO;
      ciudadano.partner = partner;

      // También actualizar el estado civil de la pareja si es necesario
      if (partner.marital_status !== MaritalStatus.CASADO) {
        partner.marital_status = MaritalStatus.CASADO;
        partner.partner = ciudadano;
        await this.ciudadanosRepository.save(partner);
      }
    }

    // Caso 2: Cambio de CASADO a SOLTERO
    else if (
      currentMaritalStatus === MaritalStatus.CASADO &&
      newMaritalStatus === MaritalStatus.SOLTERO
    ) {
      const currentPartner = ciudadano.partner;

      // Remover la relación del ciudadano actual
      ciudadano.marital_status = MaritalStatus.SOLTERO;
      ciudadano.partner = null;

      // Si la pareja actual existe, también remover su relación
      if (currentPartner) {
        currentPartner.partner = null;
        // Solo cambiar a soltero si no tiene otra pareja
        if (currentPartner.marital_status === MaritalStatus.CASADO) {
          currentPartner.marital_status = MaritalStatus.SOLTERO;
        }
        await this.ciudadanosRepository.save(currentPartner);
      }
    }

    // Caso 3: Cambio de pareja (permanece casado)
    else if (
      currentMaritalStatus === MaritalStatus.CASADO &&
      newMaritalStatus === MaritalStatus.CASADO &&
      newPartnerId
    ) {
      const currentPartner = ciudadano.partner;
      const newPartner = await this.ciudadanosRepository.findOne({
        where: { id: newPartnerId },
        relations: ['partner'],
      });

      if (!newPartner) {
        throw new BadRequestException(
          `Pareja con id ${newPartnerId} no encontrada`,
        );
      }

      // Verificar que la nueva pareja no sea el mismo ciudadano
      if (newPartner.id === ciudadano.id) {
        throw new BadRequestException(
          'Un ciudadano no puede ser pareja de sí mismo',
        );
      }

      // Verificar que la nueva pareja no esté ya casada con otra persona
      if (
        newPartner.marital_status === MaritalStatus.CASADO &&
        newPartner.partner &&
        newPartner.partner.id !== ciudadano.id
      ) {
        throw new BadRequestException(
          `La persona seleccionada ya está casada con ${newPartner.partner.name} ${newPartner.partner.last_name_father}`,
        );
      }

      // Remover relación anterior
      if (currentPartner) {
        currentPartner.partner = null;
        if (currentPartner.marital_status === MaritalStatus.CASADO) {
          currentPartner.marital_status = MaritalStatus.SOLTERO;
        }
        await this.ciudadanosRepository.save(currentPartner);
      }

      // Establecer nueva relación
      ciudadano.partner = newPartner;

      // Actualizar estado civil de la nueva pareja si es necesario
      if (newPartner.marital_status !== MaritalStatus.CASADO) {
        newPartner.marital_status = MaritalStatus.CASADO;
        newPartner.partner = ciudadano;
        await this.ciudadanosRepository.save(newPartner);
      }
    }
  }
}
