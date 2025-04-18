import { IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BasePaginatedParams } from "@shared/enums";

export class FindParamsDto {
  @ApiPropertyOptional({ description: BasePaginatedParams.query })
  @IsString()
  @IsOptional()
  query?: string;
}

export class FindByEmployee extends FindParamsDto {
  @ApiProperty({
    description:
      "The ID of the employee to find the checklist for. This should be a valid UUID format.",
  })
  @IsString()
  employeeId: string;
}
