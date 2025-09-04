import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../rol/entities/rol.entity';
import { Usuarios } from '../users/entities/user.entity';
import { CatalogoOrden } from 'src/catalogo_orden/entities/catalogo_orden.entity';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class SeedingService implements OnModuleInit {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(Usuarios)
    private readonly usuariosRepository: Repository<Usuarios>,
    @InjectRepository(CatalogoOrden)
    private readonly catalogoOrdenRepository: Repository<CatalogoOrden>,
  ) {}

  async onModuleInit() {
    console.log('🌱 Iniciando proceso de seeding...');
    await this.seedDatabase();
  }

  private async seedDatabase() {
    try {
      // Verificar si ya hay datos
      const existingRoles = await this.rolRepository.count();
      const existingUsers = await this.usuariosRepository.count();
      const existingOrders = await this.catalogoOrdenRepository.count();

      if (existingRoles === 0) {
        console.log('📝 Creando roles por defecto...');
        await this.createDefaultRoles();
      }

      if (existingUsers === 0) {
        console.log('👤 Creando usuario administrador por defecto...');
        await this.createDefaultAdmin();
      }

      if (existingOrders === 0) {
        console.log('📋 Creando órdenes por defecto...');
        await this.createDefaultOrders();
      }

      console.log('✅ Seeding completado exitosamente');
    } catch (error) {
      console.error('❌ Error durante el seeding:', error);
    }
  }

  private async createDefaultRoles() {
    const roles = [{ role_name: 'Administrador' }];

    for (const roleData of roles) {
      const role = this.rolRepository.create(roleData);
      await this.rolRepository.save(role);
      console.log(`   - Rol creado: ${roleData.role_name}`);
    }
  }

  private async createDefaultAdmin() {
    // Obtener el rol de administrador
    const adminRole = await this.rolRepository.findOne({
      where: { role_name: 'Administrador' },
    });

    if (!adminRole) {
      throw new Error('Rol de administrador no encontrado');
    }

    // Crear usuario administrador (la entidad hasheará automáticamente)
    const adminUser = this.usuariosRepository.create({
      username: 'admin',
      email: 'admin@admin.com',
      password: 'admin123', // ✅ La entidad lo hasheará automáticamente
      role: adminRole,
    });

    await this.usuariosRepository.save(adminUser);
    console.log('   - Usuario admin creado: admin@admin.com / admin123');
  }
  private async createDefaultOrders() {
  const orders = [
    { order_name: 'PRIMER ORDEN', required_points: 0},
    { order_name: 'SEGUNDO ORDEN', required_points: 100 },
    { order_name: 'TERCER ORDEN', required_points: 200 },
    { order_name: 'CUARTO ORDEN', required_points: 300 },
    { order_name: 'QUINTO ORDEN', required_points: 400 },
    { order_name: 'SEXTO ORDEN', required_points: 500 }
  ];

  for (const orderData of orders) {
    const order = this.catalogoOrdenRepository.create(orderData);
    await this.catalogoOrdenRepository.save(order);
    console.log(`   - Orden creada: ${orderData.order_name} (${orderData.required_points} puntos)`);
  }
}

  // Método público para ejecutar seeding manualmente
  async runSeeding() {
    console.log('🔄 Ejecutando seeding manual...');
    await this.seedDatabase();
  }
}
