import { ApiProperty } from "@nestjs/swagger";

export class CompanySettings {
  @ApiProperty({
    description: "ID do registro",
  })
  id: string;

  @ApiProperty({
    description: "tempo de expiração das respostas em minutos",
    type: Number,
  })
  answersExpirationTime?: number;

  @ApiProperty({
    description: "ID da empresa",
    type: Number,
  })
  company_id: number;

  @ApiProperty({
    description: "Data de criação do registro",
  })
  created_at: string;

  @ApiProperty({
    description: "Data de atualização do registro",
  })
  updated_at: string;
}
