import {
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  AnswerType,
  CheckListQuestionFieldsProperties,
  QuestionType,
} from "../enums/question-type.enum";
import { BaseMessagesValidations } from "@shared/enums";

import { notBlankRegex } from "@shared/validations/annotationsValidations";
import { Type } from "class-transformer";
import { CheckListQuestionsDto } from "./question.dto";
import { CheckListItemFieldsProperties } from "../enums/checkListItem.enum";
export class CreateCheckListItemDto {
  @ApiProperty({
    description: CheckListItemFieldsProperties.categories_id,
  })
  @IsString()
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  @IsNotEmpty({ message: BaseMessagesValidations.notEmpty })
  categoriesId: string;

  @ApiProperty({
    description: CheckListQuestionFieldsProperties.list,
    type: CheckListQuestionsDto,
    example: [
      {
        question: "O carro está sujo?",
        type: QuestionType.MULTIPLE_CHOICE,
        isRequired: true,
        answerType: AnswerType.TEXT,
        multiple_choice: [
          {
            choice: "Sim",
            isAnomaly: true,
          },
          {
            choice: "Não",
            isAnomaly: false,
          },
        ],
      },
      {
        question: "O Freio está funcionando?",
        type: QuestionType.TEXT,
        answerType: AnswerType.TEXT,

        isRequired: true,
        iaPrompt:
          "Verifique se de acordo com a resposta do funcionário o freio está funcionando corretamente." +
          " Caso não esteja, responda: Alerta de anomalia. Caso esteja, responda: Ok.",
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckListQuestionsDto)
  question_list: CheckListQuestionsDto[];
}
