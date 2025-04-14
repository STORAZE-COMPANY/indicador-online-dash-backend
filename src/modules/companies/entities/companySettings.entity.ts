import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class CompanySettings {
  @ApiProperty({
    description: "ID do registro",
  })
  id: string;

  @ApiProperty({
    description: "tempo de expiração das respostas em minutos",
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  answersExpirationTime?: number;

  @ApiProperty({
    description: "ID da empresa",
    type: Number,
  })
  @IsNumber()
  company_id: number;
}
