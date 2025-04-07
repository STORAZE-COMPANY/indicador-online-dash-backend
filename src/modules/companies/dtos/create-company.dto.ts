import { ApiProperty } from "@nestjs/swagger";
import { BaseMessagesValidations } from "@shared/enums";
import {
  notBlankRegex,
  onlyNumbersRegex,
} from "@shared/validations/annotationsValidations";
import {
  IsString,
  IsBoolean,
  IsEmail,
  Matches,
  IsNotEmpty,
} from "class-validator";

export class CreateCompanyDto {
  @ApiProperty({ example: "Empresa XYZ", description: "Nome da empresa" })
  @IsString()
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  @IsNotEmpty({ message: BaseMessagesValidations.notEmpty })
  name: string;

  @ApiProperty({
    example: "12345678000199",
    description: "CNPJ da empresa",
  })
  @IsString()
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  @IsNotEmpty({ message: BaseMessagesValidations.notEmpty })
  @Matches(onlyNumbersRegex, {
    message: BaseMessagesValidations.withoutSpecialCharacters,
  })
  cnpj: string;

  @ApiProperty({ example: true, description: "Se a empresa está ativa ou não" })
  @IsBoolean()
  isActive: boolean;
  @ApiProperty({ description: "Email da empresa" })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "1",
    description: "ID do nível de acesso associada à empresa",
  })
  @IsString()
  roleId: string;
}
