import { ApiProperty } from "@nestjs/swagger";

import { createAnswerDtoProperties } from "../enums";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import { IsNumber } from "class-validator";
import { Answers } from "../entities/asnwers.entity";

export class AnswerBaseDto {
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
  @ApiProperty({ type: "string", format: "binary" })
  image: Express.Multer.File;
}

export class AnswerResponse extends Answers {
  @ApiProperty({
    description: createAnswerDtoProperties.openIaResponse,
  })
  openIaResponse: string;
}
