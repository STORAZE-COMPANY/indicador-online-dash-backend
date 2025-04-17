import {
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BaseMessagesValidations } from "@shared/enums";
import { notBlankRegex } from "@shared/validations/annotationsValidations";
import { CheckListFieldsProperties } from "@modules/checklists/enums/checkList.enum";
import { Type } from "class-transformer";
import { CheckListItemFieldsProperties } from "../enums/checkListItem.enum";
import { CheckListQuestionFieldsProperties } from "../enums/question-type.enum";
import { CheckListQuestionsDto } from "./question.dto";

export class CreateCheckListDto {
  @ApiProperty({
    description: CheckListFieldsProperties.name,
    example: "Checklist de Segurança",
  })
  @IsString()
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  @IsNotEmpty({ message: BaseMessagesValidations.notEmpty })
  name: string;

  @ApiProperty({
    description: CheckListItemFieldsProperties.categories_id,
  })
  @ApiProperty({
    description: CheckListQuestionFieldsProperties.list,
    type: [CheckListQuestionsDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckListQuestionsDto)
  question_list: CheckListQuestionsDto[];
}
