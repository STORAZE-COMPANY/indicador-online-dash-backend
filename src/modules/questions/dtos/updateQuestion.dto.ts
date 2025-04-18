import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { QuestionFieldsProperties, QuestionType } from "../enums";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import { IsBoolean, IsEnum, IsOptional, IsUUID } from "class-validator";
import { QuestionAnswerType } from "@shared/enums";

export class UpdateQuestion {
  @ApiProperty({
    description: QuestionFieldsProperties.id,
  })
  @IsNonBlankString({ isOptional: false })
  @IsUUID()
  questionId: string;
  @ApiPropertyOptional({
    description: QuestionFieldsProperties.question,
  })
  @IsNonBlankString({ isOptional: false })
  @IsOptional()
  question?: string;

  @ApiPropertyOptional({
    description: QuestionFieldsProperties.type,
  })
  @IsEnum(QuestionType)
  @IsOptional()
  type?: QuestionType;

  @ApiPropertyOptional({
    description: QuestionFieldsProperties.isRequired,
  })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;
  @ApiPropertyOptional({
    description: QuestionFieldsProperties.checkList_id,
  })
  @IsNonBlankString({ isOptional: true })
  @IsUUID()
  @IsOptional()
  checkListItem_id?: string;

  @ApiPropertyOptional({
    description: QuestionFieldsProperties.IAPrompt,
  })
  @IsNonBlankString({ isOptional: true })
  IAPrompt?: string;

  @ApiPropertyOptional({
    description: QuestionFieldsProperties.categoryId,
  })
  @IsNonBlankString({ isOptional: true })
  @IsOptional()
  @IsUUID()
  category_id: string;

  @ApiPropertyOptional({
    description: QuestionFieldsProperties.answerType,
  })
  @IsEnum(QuestionAnswerType)
  @IsOptional()
  answerType?: QuestionAnswerType;
}
