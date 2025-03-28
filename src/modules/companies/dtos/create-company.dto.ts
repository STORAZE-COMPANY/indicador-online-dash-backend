import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsArray, IsNumber } from "class-validator";

export class CreateCompanyDto {
  @ApiProperty({ example: "Empresa XYZ", description: "Nome da empresa" })
  @IsString()
  name: string;

  @ApiProperty({
    example: "12.345.678/0001-99",
    description: "CNPJ da empresa",
  })
  @IsString()
  cnpj: string;

  @ApiProperty({ example: true, description: "Se a empresa está ativa ou não" })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    example: [101, 102, 103],
    description: "IDs dos checklists associados à empresa",
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  checklistIds: number[];
}
