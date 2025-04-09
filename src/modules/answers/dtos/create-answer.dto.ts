import { ApiProperty } from "@nestjs/swagger";

import { createAnswerDtoProperties } from "../enums";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";

class AnswerBaseDto {
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
export class CreateAnswerDto extends AnswerBaseDto {
  @ApiProperty({
    description: createAnswerDtoProperties.textAnswer,
  })
  @IsNonBlankString({ isOptional: false })
  textAnswer: string;
}
export class CreateAnswerForImageQuestionDto extends AnswerBaseDto {
  @ApiProperty({
    description: createAnswerDtoProperties.imageAnswer,
  })
  @IsNonBlankString({ isOptional: false })
  imageAnswer: string;
}
