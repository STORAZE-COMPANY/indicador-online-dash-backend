import { ApiProperty } from "@nestjs/swagger";

import { createAnswerDtoProperties } from "../enums";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import { IsNumber, IsOptional } from "class-validator";
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
    type: Number,
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
export class CreateAnomalyResolutionDTO {
  @ApiProperty({
    example: "This is a description of the anomaly resolution.",
    description: "Description of the anomaly resolution",
  })
  @IsNonBlankString({ isOptional: true })
  @IsOptional()
  description?: string;

  @ApiProperty({ type: "string", format: "binary" })
  @IsOptional()
  image?: Express.Multer.File;

  @ApiProperty({
    example: "e5b7f1c3-2d4b-4c8a-9c2b-3f6d5e7a8b9c",
    description:
      "Unique identifier for the answer associated with the anomaly resolution",
  })
  @IsNonBlankString({ isOptional: false })
  answer_id: string;
}
