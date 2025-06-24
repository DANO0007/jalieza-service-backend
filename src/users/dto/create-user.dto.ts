import { IsEmail, IsInt, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  role_id: number;
}
