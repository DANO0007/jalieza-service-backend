import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class CheckDuplicateCiudadanoDto {
  @Transform(({ value }) => value?.trim?.())
  @IsString()
  name: string;

  @Transform(({ value }) => value?.trim?.())
  @IsString()
  last_name_father: string;

  @Transform(({ value }) => value?.trim?.())
  @IsString()
  last_name_mother?: string;
}
