import { ApiProperty } from "@nestjs/swagger";
import { ChecklistOnEmployeeFieldsProperties } from "../enums";

export class checklistOnEmployee {
  @ApiProperty({
    description: ChecklistOnEmployeeFieldsProperties.id,
    example: "1234567890abcdef",
  })
  id: string;

  @ApiProperty({
    description: ChecklistOnEmployeeFieldsProperties.employeeId,
    example: "1234567890abcdef",
  })
  employee_id: number;

  @ApiProperty({
    description: ChecklistOnEmployeeFieldsProperties.checklistId,
    example: "1234567890abcdef",
  })
  checklist_id: string;
}
