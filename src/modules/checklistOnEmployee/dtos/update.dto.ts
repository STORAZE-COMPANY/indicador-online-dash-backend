import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import { IsNumber, IsOptional, IsUUID } from "class-validator";

export class checklistOnEmployeeUpdateDto {
  @ApiPropertyOptional({
    description: "Employee ID",
    example: "1234567890abcdef",
  })
  @IsNumber()
  @IsOptional()
  employee_id: number;

  @ApiProperty({
    description: "Checklist ID",
    example: "1234567890abcdef",
  })
  @IsNonBlankString({ isOptional: false })
  @IsUUID()
  checklist_id: string;
}
