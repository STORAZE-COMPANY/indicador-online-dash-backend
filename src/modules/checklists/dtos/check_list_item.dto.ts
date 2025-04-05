import {
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CheckListQuestionFieldsProperties } from "../enums/question-type.enum";
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
    type: [CheckListQuestionsDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckListQuestionsDto)
  question_list: CheckListQuestionsDto[];
}
