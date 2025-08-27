import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../rol/entities/rol.entity';
import { Usuarios } from '../users/entities/user.entity';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class SeedingService implements OnModuleInit {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(Usuarios)
    private readonly usuariosRepository: Repository<Usuarios>,
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

      if (existingRoles === 0) {
        console.log('📝 Creando roles por defecto...');
        await this.createDefaultRoles();
      }

      if (existingUsers === 0) {
        console.log('👤 Creando usuario administrador por defecto...');
        await this.createDefaultAdmin();
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

  // Método público para ejecutar seeding manualmente
  async runSeeding() {
    console.log('🔄 Ejecutando seeding manual...');
    await this.seedDatabase();
  }
}
