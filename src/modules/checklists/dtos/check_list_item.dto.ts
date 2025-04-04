import {
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  CheckListFieldsProperties,
  QuestionType,
} from "../enums/question-type.enum";
import { BaseMessagesValidations } from "@shared/enums";

import { notBlankRegex } from "@shared/validations/annotationsValidations";
import { Type } from "class-transformer";
import { CheckListQuestionsDto } from "./question.dto";
export class CreateCheckListItemDto {
  @ApiProperty({
    description: CheckListFieldsProperties.categories_id,
  })
  @IsString()
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  @IsNotEmpty({ message: BaseMessagesValidations.notEmpty })
  categoriesId: string;

  @ApiProperty({
    description: CheckListFieldsProperties.question_list,
    example: [
      {
        question: "Qual é a sua idade?",
        type: QuestionType.TEXT,
        isRequired: true,
        multiple_choice: [
          {
            choice: "Sim",
            isAnomaly: false,
          },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckListQuestionsDto)
  question_list: CheckListQuestionsDto[];
}
