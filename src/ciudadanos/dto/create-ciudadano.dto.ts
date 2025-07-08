import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCiudadanoDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  name: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  last_name_father: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  last_name_mother: string;

  @Type(() => Date)
  @IsDate()
  birth_date: Date;

  @Transform(({ value }) => value.trim())
  @IsString()
  phone: string;

  @IsString()
  marital_status: string|null;

  @IsOptional()
  @IsNumber()
  partner: number; // Puedes dejarlo como partner_id si usas solo el ID
}
