import { ApiProperty } from "@nestjs/swagger";
import { BaseMessagesValidations } from "@shared/enums";
import { onlyNumbersRegex } from "@shared/validations/annotationsValidations";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  Matches,
} from "class-validator";

export class UpdateCompanyDto {
  @ApiProperty({
    description: "ID da empresa",
  })
  @IsNumber({})
  id: number;

  @ApiProperty({ example: "Empresa XYZ", description: "Nome da empresa" })
  @IsNonBlankString({ isOptional: true })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: "12345678000199",
    description: "CNPJ da empresa",
  })
  @IsNonBlankString({ isOptional: true })
  @IsOptional()
  @Matches(onlyNumbersRegex, {
    message: BaseMessagesValidations.withoutSpecialCharacters,
  })
  cnpj?: string;

  @ApiProperty({ example: true, description: "Se a empresa está ativa ou não" })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
  @ApiProperty({ description: "Email da empresa" })
  @IsEmail()
  @IsOptional()
  email?: string;
}
