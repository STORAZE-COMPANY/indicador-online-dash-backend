import { ApiProperty } from "@nestjs/swagger";
import { BasePaginatedParams } from "@shared/enums";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import { AnswerFieldsProperties } from "../enums";
import { IsString } from "class-validator";

export class FindParamsDto {
  @ApiProperty({ description: BasePaginatedParams.limit })
  @IsNonBlankString({ isOptional: false })
  @IsString()
  limit: string;

  @ApiProperty({ description: BasePaginatedParams.page })
  @IsString()
  @IsNonBlankString({ isOptional: false })
  page: string;
}
export class QuestionId extends FindParamsDto {
  @ApiProperty({ description: AnswerFieldsProperties.question_id })
  @IsNonBlankString({ isOptional: false })
  @IsString()
  question_id: string;
}
