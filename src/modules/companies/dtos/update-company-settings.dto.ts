import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class UpdateCompanySettingsDto {
  @ApiPropertyOptional({
    description: "Tempo de expiração das respostas das checklists em minutos",
  })
  @IsNumber()
  @IsOptional()
  answersExpirationTime?: number;

  @ApiProperty({
    description: "ID da empresa",
  })
  @IsNumber()
  company_id: number;
}
