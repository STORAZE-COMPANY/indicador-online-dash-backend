import {
  IsEmail,
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEmployeeDto {
  @ApiProperty({ description: "Nome do funcionário" })
  @IsString()
  @IsNotEmpty({ message: "O nome não pode estar vazio" })
  @Matches(/^(?!\s*$).+/, { message: "O Nome não pode conter apenas espaços" }) // Impede só espaços
  name: string;

  @ApiProperty({ description: "Email do funcionário" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Telefone do funcionário" })
  @IsString()
  @Matches(/^[0-9]{11}$/, {
    message:
      "O telefone deve conter exatamente 11 dígitos numéricos (sem pontos, barras ou outros caracteres especiais).",
  })
  @Matches(/^(?!\s*$).+/, { message: "O Nome não pode conter apenas espaços" }) // Impede só espaços
  phone: string;

  @ApiProperty({ description: "ID da empresa do funcionário" })
  @IsNumber({}, { message: "O ID da empresa deve ser um número" })
  @Min(1, { message: "O ID da empresa deve ser um número positivo" })
  company_id: number;
}
