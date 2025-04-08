import {
  QuestionFieldsProperties,
  QuestionType,
} from "@modules/questions/enums";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Anomalies, QuestionAnswerType } from "@shared/enums";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNumber } from "class-validator";
export class choicesDto {
  @ApiProperty({
    type: String,
  })
  @IsNonBlankString({ isOptional: false })
  choice: string;
  @ApiPropertyOptional({
    enum: Anomalies,
  })
  @IsEnum(Anomalies)
  anomaly?: Anomalies;
}
export class QuestionDto {
  @ApiProperty({
    description: QuestionFieldsProperties.question,
  })
  @IsNonBlankString({ isOptional: false })
  question: string;

  @ApiProperty({
    description: QuestionFieldsProperties.type,
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiProperty({
    description: QuestionFieldsProperties.employee_id,
  })
  @IsNumber()
  employee_id: number;

  @ApiProperty({
    description: QuestionFieldsProperties.isRequired,
  })
  @IsBoolean()
  isRequired: boolean;
  @ApiProperty({
    description: QuestionFieldsProperties.checkList_id,
  })
  @IsNonBlankString({ isOptional: false })
  checkListItem_id: string;

  @ApiProperty({
    description: QuestionFieldsProperties.IAPrompt,
  })
  @IsNonBlankString({ isOptional: true })
  IAPrompt?: string;

  @ApiProperty({
    description: QuestionFieldsProperties.answerType,
  })
  @IsEnum(QuestionAnswerType)
  answerType: QuestionAnswerType;

  @ApiPropertyOptional({
    type: [choicesDto],
    description: QuestionFieldsProperties.choices,
  })
  @IsArray()
  @Type(() => choicesDto)
  choices?: choicesDto[];
}
