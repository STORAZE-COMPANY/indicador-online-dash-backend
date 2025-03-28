import { IsEmail, IsString, MinLength, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEmployeeDto {
  @ApiProperty({ description: "Nome do funcionário" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Email do funcionário" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Senha do funcionário (mínimo de 4 caracteres)" })
  @MinLength(4)
  password: string;

  @ApiProperty({ description: "ID da empresa do funcionário" })
  @IsNumber()
  companyId: number;
}
