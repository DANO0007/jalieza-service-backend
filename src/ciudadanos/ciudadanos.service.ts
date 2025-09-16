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
import { CiudadanoResponse, CiudadanoListResponse, CiudadanoCreateResponse,CiudadanoUpdateResponse } from './interfaces/ciudadano-response.interface';
import { calculateAge, formatDateOnly, validateBirthDate } from './utils/date-validator.util';
import { MaritalStatusService } from './services/marital-status.service';
import { PointsManagementService } from './services/points-management.service';


@Injectable()
export class CiudadanosService {
  constructor(
    @InjectRepository(Ciudadanos)
    private readonly ciudadanosRepository: Repository<Ciudadanos>,
    private readonly maritalStatusService: MaritalStatusService,
    private readonly pointsManagementService: PointsManagementService,
  ) {}

  //Valida si el ciudadano ya existe
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
          birth_date: formatDateOnly(existingCiudadano.birth_date),
          age: calculateAge(existingCiudadano.birth_date),
        }
      : null,
  };
  }

  //Obtiene los estados civiles
  getMaritalStatuses() {
    return [
      { id: MaritalStatus.SOLTERO, label: MaritalStatusLabels[MaritalStatus.SOLTERO] },
      { id: MaritalStatus.CASADO, label: MaritalStatusLabels[MaritalStatus.CASADO] },
    ];
  }

  //Busca ciudadanos por nombre, apellido paterno, apellido materno
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
      birth_date: formatDateOnly(c.birth_date),
      age: calculateAge(c.birth_date),
      full_name:
        `${c.name} ${c.last_name_father} ${c.last_name_mother || ''}`.trim(),
    }));
  }

  //Registra un nuevo ciudadano
  async createCiudadano(dto: CreateCiudadanoDto): Promise<CiudadanoCreateResponse> {
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

    // Validar estado civil y pareja usando el servicio especializado
    const partnerEntity = await this.maritalStatusService.validateCiudadanoCreation(
      marital_status,
      partnerId,
    );

    let localDate: Date | null = null;

    if (birth_date) {
      try {
        // Usar la función de validación que incluye límites de edad
        localDate = validateBirthDate(new Date(birth_date));
      } catch (error) {
        // Si la validación falla, lanzar el error
        throw error;
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
        birth_date: formatDateOnly(saved.birth_date),
        age: calculateAge(saved.birth_date),
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

  //Obtiene todos los ciudadanos
  async findAll(includeDeleted: boolean = false): Promise<CiudadanoListResponse[]> {
    const ciudadanos = await this.ciudadanosRepository.find({
      relations: ['partner', 'services', 'services.catalogoServicio'],
      withDeleted: includeDeleted,
    });

    return ciudadanos.map((c): CiudadanoListResponse => ({
      id: c.id,
      name: c.name,
      last_name_father: c.last_name_father,
      last_name_mother: c.last_name_mother,
      comment: c.comment,
      birth_date: formatDateOnly(c.birth_date),
      age: calculateAge(c.birth_date),
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
        service_status: s.service_status,
        observations: s.observations,
        })) || [],
      candidatoACargo: null,
    }));
  }

  //Obtiene un ciudadano por id
  async findOne(id: number, includeDeleted: boolean = false): Promise<CiudadanoListResponse> {
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
    birth_date: formatDateOnly(ciudadano.birth_date),
    age: calculateAge(ciudadano.birth_date),
    phone: ciudadano.phone,
    marital_status: ciudadano.marital_status || null,
    partner: ciudadano.partner
      ? {
          id: ciudadano.partner.id,
          name: ciudadano.partner.name,
          last_name_father: ciudadano.partner.last_name_father,
          last_name_mother: ciudadano.partner.last_name_mother,
        }
      : null,
    ...(includeDeleted && {
      visible: !ciudadano.deleted_at,
      deleted_at: ciudadano.deleted_at,
    }),
    services:
      ciudadano.services?.map((s) => ({
        id: s.id,
        service_name: s.catalogoServicio?.service_name || 'Sin nombre',
        start_date: s.start_date,
        end_date: s.end_date,
        service_status: s.service_status,
        observations: s.observations,
      })) || [],
    candidatoACargo: null,
  };
  }

  //Actualiza un ciudadano
  async update(id: number, updateCiudadanoDto: UpdateCiudadanoDto): Promise<CiudadanoUpdateResponse> {
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

    // Manejar cambios de estado civil usando el MaritalStatusService
    if (newMaritalStatus !== undefined) {
      // ✅ VALIDAR antes del cambio
      this.maritalStatusService.validateMaritalStatusUpdate(newMaritalStatus, newPartnerId);
      
      await this.maritalStatusService.handleMaritalStatusChange(
        ciudadano,
        newMaritalStatus,
        newPartnerId,
      );
    }

    // Actualizar otros campos
    Object.assign(ciudadano, otherFields);

    const saved = await this.ciudadanosRepository.save(ciudadano);

    const response: CiudadanoResponse = {
    id: saved.id,
    name: saved.name,
    last_name_father: saved.last_name_father,
    last_name_mother: saved.last_name_mother,
    comment: saved.comment,
    birth_date: formatDateOnly(saved.birth_date),
    age: calculateAge(saved.birth_date),
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
  };

  return {
    message: 'Ciudadano actualizado exitosamente',
    data: response,
  };
  }

  //Elimina un ciudadano
  async remove(id: number) {
    const ciudadano = await this.ciudadanosRepository.findOne({ 
      where: { id },
      relations: ['partner'] // Incluir relación de pareja
    });
    
    if (!ciudadano) {
      throw new NotFoundException(`Citizen with id ${id} not found`);
    }

    // Si el ciudadano tiene pareja, actualizar su estado civil antes de borrarlo
    if (ciudadano.partner) {
      // Cambiar el estado civil del ciudadano a soltero
      await this.maritalStatusService.handleMaritalStatusChange(
        ciudadano,
        MaritalStatus.SOLTERO,
        undefined // Sin nueva pareja
      );
      
      // También actualizar el estado civil de la pareja que queda
      const pareja = ciudadano.partner;
      if (pareja && pareja.marital_status === MaritalStatus.CASADO) {
        pareja.marital_status = MaritalStatus.SOLTERO;
        pareja.partner = null;
        await this.ciudadanosRepository.save(pareja);
      }
    }

    return await this.ciudadanosRepository.softRemove(ciudadano);
  }
  
  //Restaura un ciudadano
  /* async restaurarCiudadano(id: number) {
    return await this.ciudadanosRepository.restore(id);
  } */ 

  // ✅ Obtener órdenes disponibles para un ciudadano
  async getOrdenesDisponibles(ciudadanoId: number) {
    return await this.pointsManagementService.getOrdenesDisponibles(ciudadanoId);
  }

  // ✅ Obtener puntos de un ciudadano (INCLUYE puntos de la pareja si está casado)
  async getPuntosCiudadano(ciudadanoId: number) {
    const [puntos, totalPuntos, ciudadano] = await Promise.all([
      this.pointsManagementService.getPuntosByCiudadano(ciudadanoId),
      this.pointsManagementService.getTotalPuntos(ciudadanoId),
      this.ciudadanosRepository.findOne({
        where: { id: ciudadanoId },
        relations: ['partner']
      })
    ]);
    
    const response = {
      totalPuntos,
      puntosPorOrden: puntos.map(p => ({
        orden: p.orden.order_name,
        puntos: p.puntos
      })),
      // ✅ NUEVO: Información sobre si está casado y comparte puntos
      esCasado: ciudadano?.marital_status === MaritalStatus.CASADO,
      pareja: ciudadano?.partner ? {
        id: ciudadano.partner.id,
        nombre: `${ciudadano.partner.name} ${ciudadano.partner.last_name_father}`
      } : null,
      mensaje: ciudadano?.marital_status === MaritalStatus.CASADO && ciudadano?.partner 
        ? 'Los puntos mostrados incluyen los de tu pareja' 
        : 'Puntos individuales'
    };

    return response;
  }
}
