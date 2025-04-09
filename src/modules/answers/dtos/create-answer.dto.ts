import { ApiProperty } from "@nestjs/swagger";

import { createAnswerDtoProperties } from "../enums";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import { IsNumber } from "class-validator";

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

export class CreateAnswerChoice {
  @ApiProperty({
    description: createAnswerDtoProperties.employee_id,
  })
  @IsNumber()
  employee_id: number;

  @ApiProperty({
    description: createAnswerDtoProperties.textAnswer,
  })
  @IsNonBlankString({ isOptional: false })
  choice_id: string;
}
export class CreateAnswerForImageQuestionDto extends AnswerBaseDto {
  @ApiProperty({
    description: createAnswerDtoProperties.imageAnswer,
  })
  @IsNonBlankString({ isOptional: false })
  imageAnswer: string;
}
