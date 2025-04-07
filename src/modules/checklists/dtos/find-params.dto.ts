import { IsString, IsOptional, Validate } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BasePaginatedParams } from "@shared/enums";
import { FindParamsEnum } from "../enums/find.enum";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import { IsStartBeforeEndConstraint } from "@shared/validations/annotationsValidations/classValidators/dateInitEnd";

class Period {
  @ApiPropertyOptional({
    description: BasePaginatedParams.startDate,
  })
  @IsNonBlankString()
  startDate: string;
  @ApiPropertyOptional({
    description: BasePaginatedParams.endDate,
  })
  @IsNonBlankString()
  endDate: string;

  @Validate(IsStartBeforeEndConstraint)
  validateDates: boolean; // esse campo é apenas para acionar o validador de classe
}

export class FindParamsDto extends Period {
  @ApiPropertyOptional({ description: FindParamsEnum.byCompany })
  @IsString()
  @IsOptional()
  byCompany: number;

  @ApiPropertyOptional({ description: FindParamsEnum.hasAnomaly })
  @IsOptional()
  hasAnomaly: boolean;

  @ApiProperty({ description: BasePaginatedParams.limit })
  @IsNonBlankString()
  limit: string;

  @ApiProperty({ description: BasePaginatedParams.page })
  @IsNonBlankString()
  page: string;
}
