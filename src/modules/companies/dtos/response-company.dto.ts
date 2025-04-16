import { ApiProperty } from "@nestjs/swagger";
import { CompaniesFieldsProperties } from "../enums";
import { CompanySettings } from "../entities/companySettings.entity";

export class CompanyResponse {
  @ApiProperty({ example: 1, description: CompaniesFieldsProperties.id })
  id: number;

  @ApiProperty({
    example: "Empresa XYZ",
    description: CompaniesFieldsProperties.name,
  })
  name: string;

  @ApiProperty({
    example: "emprese@empresa.com",
    description: CompaniesFieldsProperties.email,
  })
  email: string;

  @ApiProperty({
    example: "12.345.678/0001-99",
    description: CompaniesFieldsProperties.cnpj,
  })
  cnpj: string;

  @ApiProperty({
    example: true,
    description: CompaniesFieldsProperties.isActive,
  })
  isActive: boolean;

  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: CompaniesFieldsProperties.created_at,
    required: false,
  })
  created_at?: Date;

  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: CompaniesFieldsProperties.updated_at,
    required: false,
  })
  updated_at?: Date;
}

export class FindCompanySettings extends CompanySettings {
  @ApiProperty({
    description: CompaniesFieldsProperties.name,
  })
  companyName: string;
}
