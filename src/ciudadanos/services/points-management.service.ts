import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiciosCiudadano } from '../../servicios_ciudadanos/entities/servicios_ciudadano.entity';
import { CatalogoOrden } from '../../catalogo_orden/entities/catalogo_orden.entity';
import { ServiceStatus } from '../../servicios_ciudadanos/enums/service-status.enum';
import { SeedingService } from '../../seeding/seeding.service';

@Injectable()
export class PointsManagementService {
  constructor(
    @InjectRepository(ServiciosCiudadano)
    private readonly serviciosRepository: Repository<ServiciosCiudadano>,
    @InjectRepository(CatalogoOrden)
    private readonly catalogoOrdenRepository: Repository<CatalogoOrden>,
    private readonly seedingService: SeedingService,
  ) {}

  // ✅ Método para obtener puntos por orden desde configuración centralizada
  private getPuntosPorOrden(ordenId: number): number {
    const config = this.seedingService.getOrdenesConfig();
    return config[ordenId]?.puntos_por_servicio || 0;
  }

  // ✅ Método privado centralizado para obtener servicios completados
  private async getServiciosCompletados(ciudadanoId: number): Promise<ServiciosCiudadano[]> {
    return await this.serviciosRepository.find({
      where: {
        citizen: { id: ciudadanoId },
        service_status: ServiceStatus.completed
      },
      relations: ['catalogoServicio', 'catalogoServicio.order']
    });
  }


  /**
   * Obtiene los puntos de un ciudadano por orden (calculados dinámicamente)
   */
  async getPuntosByCiudadano(ciudadanoId: number): Promise<Array<{orden: CatalogoOrden, puntos: number}>> {
    const serviciosCompletados = await this.getServiciosCompletados(ciudadanoId);

    // Agrupar por orden y contar puntos
    const puntosPorOrden = new Map<number, {orden: CatalogoOrden, puntos: number}>();
    
    for (const servicio of serviciosCompletados) {
      const ordenId = servicio.catalogoServicio.order.id;
      const puntosPorServicio = this.getPuntosPorOrden(ordenId);
      
      if (puntosPorOrden.has(ordenId)) {
        puntosPorOrden.get(ordenId).puntos += puntosPorServicio;
      } else {
        puntosPorOrden.set(ordenId, {
          orden: servicio.catalogoServicio.order,
          puntos: puntosPorServicio
        });
      }
    }

    return Array.from(puntosPorOrden.values());
  }

  /**
   * Obtiene el total de puntos acumulados de un ciudadano
   */
  async getTotalPuntos(ciudadanoId: number): Promise<number> {
    const serviciosCompletados = await this.getServiciosCompletados(ciudadanoId);

    return serviciosCompletados.reduce((total, servicio) => {
      const puntosPorOrden = this.getPuntosPorOrden(servicio.catalogoServicio.order.id);
      return total + puntosPorOrden;
    }, 0);
  }

  /**
   * Obtiene las órdenes disponibles para un ciudadano
   */
  async getOrdenesDisponibles(ciudadanoId: number): Promise<CatalogoOrden[]> {
    const totalPuntos = await this.getTotalPuntos(ciudadanoId);

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
    // ✅ Optimización: Hacer ambas consultas en paralelo
    const [totalPuntos, orden] = await Promise.all([
      this.getTotalPuntos(ciudadanoId),
      this.catalogoOrdenRepository.findOneBy({ id: ordenId })
    ]);
    
    if (!orden) return false;
    return totalPuntos >= orden.required_points;
  }
}