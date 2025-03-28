import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

export class UpdateCompanyDto {
  @ApiProperty({ example: "Empresa XYZ", description: "Nome da empresa" })
  @IsString()
  @Optional()
  name: string;

  @ApiProperty({
    example: "12.345.678/0001-99",
    description: "CNPJ da empresa",
  })
  @IsString()
  @Optional()
  cnpj: string;

  @ApiProperty({ example: true, description: "Se a empresa está ativa ou não" })
  @IsBoolean()
  @Optional()
  isActive: boolean;

  @ApiProperty({
    example: [101, 102, 103],
    description: "IDs dos checklists associados à empresa",
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @Optional()
  checklistIds: number[];
}
