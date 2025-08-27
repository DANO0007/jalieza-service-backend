import { Controller, Post, UseGuards } from '@nestjs/common';
import { SeedingService } from './seeding.service';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('seeding')
export class SeedingController {
  constructor(private readonly seedingService: SeedingService) {}

  @Post('run')
  @UseGuards(AuthGuard) // Solo usuarios autenticados pueden ejecutar seeding
  async runSeeding() {
    await this.seedingService.runSeeding();
    return { message: 'Seeding ejecutado exitosamente' };
  }
}
