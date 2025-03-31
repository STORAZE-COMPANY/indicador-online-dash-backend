import { IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class FindParamsDto {
  @ApiPropertyOptional({ description: "Query de busca" })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiProperty({ description: "Limite de registros" })
  @IsString()
  limit: string;

  @ApiProperty({ description: "Offset de registros" })
  @IsString()
  page: string;
}
