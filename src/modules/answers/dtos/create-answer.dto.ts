import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { createAnswerDtoProperties } from "../enums";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";

export class CreateAnswerDto {
  @ApiPropertyOptional({
    description: createAnswerDtoProperties.textAnswer,
  })
  @IsNonBlankString({ isOptional: true })
  textAnswer?: string;

  @ApiPropertyOptional({
    description: createAnswerDtoProperties.imageAnswer,
  })
  @IsNonBlankString({ isOptional: true })
  imageAnswer?: string;

  @ApiProperty({
    description: createAnswerDtoProperties.question_id,
  })
  @IsNonBlankString({ isOptional: false })
  question_id: string;

  @ApiProperty({
    description: createAnswerDtoProperties.employee_id,
  })
  @IsNonBlankString({ isOptional: false })
  employee_id: string;
}
