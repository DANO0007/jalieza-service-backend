import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadanoPuntos } from '../entities/ciudadano-puntos.entity';
import { Ciudadanos } from '../entities/ciudadano.entity';
import { CatalogoOrden } from '../../catalogo_orden/entities/catalogo_orden.entity';

@Injectable()
export class PointsManagementService {
  constructor(
    @InjectRepository(CiudadanoPuntos)
    private readonly ciudadanoPuntosRepository: Repository<CiudadanoPuntos>,
    @InjectRepository(CatalogoOrden)
    private readonly catalogoOrdenRepository: Repository<CatalogoOrden>,
  ) {}

  // Puntos hardcodeados por orden
  private readonly PUNTOS_POR_ORDEN = {
    1: 10, // PRIMER ORDEN
    2: 15, // SEGUNDO ORDEN
    3: 20, // TERCER ORDEN
    4: 25, // CUARTO ORDEN
    5: 30, // QUINTO ORDEN
    6: 35, // SEXTO ORDEN
  };


  /**
   * Obtiene los puntos de un ciudadano por orden
   */
  async getPuntosByCiudadano(ciudadanoId: number): Promise<CiudadanoPuntos[]> {
    return await this.ciudadanoPuntosRepository.find({
      where: { ciudadano: { id: ciudadanoId } },
      relations: ['orden'],
    });
  }

  /**
   * Obtiene el total de puntos acumulados de un ciudadano
   */
  async getTotalPuntos(ciudadanoId: number): Promise<number> {
    const puntos = await this.getPuntosByCiudadano(ciudadanoId);
    return puntos.reduce((sum, p) => sum + p.puntos_acumulados, 0);
  }

  /**
   * Obtiene las órdenes disponibles para un ciudadano
   */
  async getOrdenesDisponibles(ciudadanoId: number): Promise<CatalogoOrden[]> {
    const puntos = await this.getPuntosByCiudadano(ciudadanoId);
    const totalPuntos = puntos.reduce((sum, p) => sum + p.puntos_acumulados, 0);

    return await this.catalogoOrdenRepository
      .createQueryBuilder('orden')
      .leftJoinAndSelect('orden.services', 'services')
      .where('orden.required_points <= :totalPuntos', { totalPuntos })
      .orderBy('orden.required_points', 'ASC')
      .getMany();
  }

  /**
   * Verifica si un ciudadano puede acceder a una orden
   */
  async canAccessOrden(ciudadanoId: number, ordenId: number): Promise<boolean> {
  const puntos = await this.getPuntosByCiudadano(ciudadanoId);
  const totalPuntos = puntos.reduce((sum, p) => sum + p.puntos_acumulados, 0);
  
  const orden = await this.catalogoOrdenRepository.findOneBy({ id: ordenId });
  if (!orden) return false;

  return totalPuntos >= orden.required_points; // ✅ Usar la BD
}

  /**
   * Agrega puntos a un ciudadano por completar un servicio
   */
  async addPuntos(ciudadanoId: number, ordenId: number): Promise<void> {
    const puntosToAdd = this.PUNTOS_POR_ORDEN[ordenId] || 0;
    
    if (puntosToAdd === 0) return;

    // Buscar si ya existe un registro de puntos para esta orden
    let ciudadanoPuntos = await this.ciudadanoPuntosRepository.findOne({
      where: {
        ciudadano: { id: ciudadanoId },
        orden: { id: ordenId },
      },
    });

    if (ciudadanoPuntos) {
      // Actualizar puntos existentes
      ciudadanoPuntos.puntos_acumulados += puntosToAdd;
    } else {
      // Crear nuevo registro
      ciudadanoPuntos = this.ciudadanoPuntosRepository.create({
        ciudadano: { id: ciudadanoId },
        orden: { id: ordenId },
        puntos_acumulados: puntosToAdd,
      });
    }

    await this.ciudadanoPuntosRepository.save(ciudadanoPuntos);
  }

  /**
   * Remueve puntos de un ciudadano (cuando cambia de completado a otro estado)
   */
  async removePuntos(ciudadanoId: number, ordenId: number): Promise<void> {
    const puntosToRemove = this.PUNTOS_POR_ORDEN[ordenId] || 0;
    
    if (puntosToRemove === 0) return;

    // Buscar el registro de puntos para esta orden
    const ciudadanoPuntos = await this.ciudadanoPuntosRepository.findOne({
      where: {
        ciudadano: { id: ciudadanoId },
        orden: { id: ordenId },
      },
    });

    if (ciudadanoPuntos) {
      // Restar los puntos
      ciudadanoPuntos.puntos_acumulados = Math.max(0, ciudadanoPuntos.puntos_acumulados - puntosToRemove);
      
      // Si los puntos llegan a 0, eliminar el registro
      if (ciudadanoPuntos.puntos_acumulados === 0) {
        await this.ciudadanoPuntosRepository.remove(ciudadanoPuntos);
      } else {
        await this.ciudadanoPuntosRepository.save(ciudadanoPuntos);
      }
    }
  }
}