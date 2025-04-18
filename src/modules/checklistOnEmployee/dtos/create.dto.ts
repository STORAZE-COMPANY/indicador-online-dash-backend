import { ApiProperty } from "@nestjs/swagger";

import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import { IsNumber, IsUUID } from "class-validator";

export class checklistOnEmployeeCreateDto {
  @ApiProperty({
    description: "Employee ID",
  })
  @IsNumber()
  employee_id: number;

  @ApiProperty({
    description: "Checklist ID",
    example: "1234567890abcdef",
  })
  @IsNonBlankString({ isOptional: false })
  @IsUUID()
  checklist_id: string;
}
