import { IsString, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BasePaginatedParams } from "@shared/enums";
import { FindParamsEnum } from "../enums/find.enum";

export class FindParamsDto {
  @ApiPropertyOptional({ description: BasePaginatedParams.byPeriod })
  @IsString()
  @IsOptional()
  byPeriod: string;

  @ApiPropertyOptional({ description: FindParamsEnum.byCompany })
  @IsString()
  @IsOptional()
  byCompany: number;

  @ApiPropertyOptional({ description: FindParamsEnum.hasAnomaly })
  @IsBoolean()
  @IsOptional()
  hasAnomaly: boolean;

  @ApiProperty({ description: BasePaginatedParams.limit })
  @IsString()
  limit: string;

  @ApiProperty({ description: BasePaginatedParams.page })
  @IsString()
  page: string;
}
