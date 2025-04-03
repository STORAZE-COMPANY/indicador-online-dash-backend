import { IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BasePaginatedParams } from "@shared/enums";

export class FindParamsDto {
  @ApiPropertyOptional({ description: BasePaginatedParams.query })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiProperty({ description: BasePaginatedParams.limit })
  @IsString()
  limit: string;

  @ApiProperty({ description: BasePaginatedParams.page })
  @IsString()
  page: string;
}
