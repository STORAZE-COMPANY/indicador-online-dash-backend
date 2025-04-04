import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  CheckListMultipleChoiceFieldsProperties,
  CheckListQuestionFieldsProperties,
  QuestionType,
} from "../enums/question-type.enum";
import { BaseMessagesValidations } from "@shared/enums";
import { notBlankRegex } from "@shared/validations/annotationsValidations";
import { Type } from "class-transformer";

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
  })
  @IsBoolean()
  isAnomaly: boolean;
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
    description: CheckListQuestionFieldsProperties.type,
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiProperty({
    description: CheckListQuestionFieldsProperties.isRequired,
  })
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty({
    description: CheckListQuestionFieldsProperties.tableName,
    example: [
      {
        choice: "Sim",
        isAnomaly: false,
      },
    ],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckListMultipleChoiceDto)
  multiple_choice?: CheckListMultipleChoiceDto[];
}
