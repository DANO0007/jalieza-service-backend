import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TerminationStatus } from '../enums/termination-status.enum';

export class CreateServiciosCiudadanoDto {
  @IsInt()
  ciudadano_id: number;

  @IsInt()
  service_id: number;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsEnum(TerminationStatus)
  termination_status: TerminationStatus;

  @IsString()
  @IsOptional()
  observations?: string;
}
