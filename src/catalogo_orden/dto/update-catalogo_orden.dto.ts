import { PartialType } from '@nestjs/mapped-types';
import { CreateCatalogoOrdenDto } from './create-catalogo_orden.dto';

export class UpdateCatalogoOrdenDto extends PartialType(CreateCatalogoOrdenDto) {}
