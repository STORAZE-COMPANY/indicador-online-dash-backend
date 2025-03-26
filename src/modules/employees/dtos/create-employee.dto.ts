import { IsEmail, IsString, MinLength, IsNumber } from "class-validator";

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(4)
  password: string;

  @IsNumber()
  companyId: number;
}
