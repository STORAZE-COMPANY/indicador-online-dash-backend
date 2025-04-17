import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  AnswerType,
  CheckListMultipleChoiceFieldsProperties,
  CheckListQuestionFieldsProperties,
  QuestionType,
} from "../enums/question-type.enum";
import { Anomalies, BaseMessagesValidations } from "@shared/enums";
import { notBlankRegex } from "@shared/validations/annotationsValidations";
import { Type } from "class-transformer";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";

export class CheckListMultipleChoiceDto {
  @ApiProperty({
    description: CheckListMultipleChoiceFieldsProperties.choice,
  })
  @IsString()
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  @IsNotEmpty({ message: BaseMessagesValidations.notEmpty })
  choice: string;

  @ApiProperty({
    description: CheckListMultipleChoiceFieldsProperties.isAnomaly,
    enum: Anomalies,
    nullable: true,
  })
  @IsOptional()
  @IsEnum([Anomalies.anomaly, Anomalies.anomaly_restricted])
  anomalyStatus: Anomalies | null;
}
export class CheckListQuestionsDto {
  @ApiProperty({
    description: CheckListQuestionFieldsProperties.question,
  })
  @IsString()
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  @IsNotEmpty({ message: BaseMessagesValidations.notEmpty })
  question: string;

  @ApiProperty({
    description: CheckListQuestionFieldsProperties.categories_id,
  })
  @IsString()
  @IsNonBlankString({ isOptional: false })
  category_id: string;

  @ApiProperty({
    description: CheckListQuestionFieldsProperties.answerType,
    enum: AnswerType,
  })
  @IsEnum(AnswerType)
  answerType: AnswerType;

  @ApiProperty({
    description: CheckListQuestionFieldsProperties.type,
    enum: QuestionType,
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiProperty({
    description: CheckListQuestionFieldsProperties.isRequired,
  })
  @IsBoolean()
  isRequired: boolean;

  @ApiPropertyOptional({
    description: CheckListQuestionFieldsProperties.prompt,
  })
  @IsString()
  @IsOptional()
  iaPrompt?: string;

  @ApiProperty({
    description: CheckListQuestionFieldsProperties.tableName,
    type: [CheckListMultipleChoiceDto],

    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckListMultipleChoiceDto)
  multiple_choice?: CheckListMultipleChoiceDto[];
}
