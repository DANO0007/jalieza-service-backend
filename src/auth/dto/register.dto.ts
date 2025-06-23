import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsNumber, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  username: string;

  @Transform(({ value }) => value.trim())
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @IsNumber()
  role_id: number;
}
