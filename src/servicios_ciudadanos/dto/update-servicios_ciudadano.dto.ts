import { PartialType } from '@nestjs/mapped-types';
import { CreateServiciosCiudadanoDto } from './create-servicios_ciudadano.dto';

export class UpdateServiciosCiudadanoDto extends PartialType(CreateServiciosCiudadanoDto) {}
