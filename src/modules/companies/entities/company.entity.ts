import { ApiProperty } from "@nestjs/swagger";

export class Company {
  @ApiProperty({ example: 1, description: "ID único da empresa" })
  id: number;

  @ApiProperty({ example: "Empresa XYZ", description: "Nome da empresa" })
  name: string;

  @ApiProperty({
    example: "12.345.678/0001-99",
    description: "CNPJ da empresa",
  })
  cnpj: string;

  @ApiProperty({ example: true, description: "Se a empresa está ativa ou não" })
  isActive: boolean;

  @ApiProperty({
    example: [101, 102, 103],
    description: "IDs dos checklists associados à empresa",
    type: [Number],
  })
  checklistIds: number[];

  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: "Data de criação da empresa",
    required: false,
  })
  created_at?: Date;

  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: "Última atualização da empresa",
    required: false,
  })
  updated_at?: Date;
}
