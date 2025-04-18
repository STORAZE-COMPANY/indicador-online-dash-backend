import { ApiProperty } from "@nestjs/swagger";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import { IsNumber } from "class-validator";

export class BatchConnectCompanyToChecklistDto {
  @ApiProperty({
    description: "The ID of the company to connect to the checklist",
    example: 1,
  })
  @IsNumber()
  companyId: number;

  @ApiProperty({
    description: "The ID of the checklist to connect to the company",
    example: 1,
  })
  @IsNonBlankString({ isOptional: false })
  checklistId: string;
}
