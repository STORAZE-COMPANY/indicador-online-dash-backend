import {
  IsArray,
  IsBoolean,
  IsDate,
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
import { CheckListItem } from "../entities/checkListItem.entity";

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

export class CheckListItemFormattedList {
  @ApiProperty({ description: CheckListItemFieldsProperties.id })
  @IsString()
  checklistItemId: string;

  @ApiProperty({
    description: CheckListItemFieldsProperties.categories_id,
  })
  @IsString()
  categories_id: string;

  @ApiProperty({
    description: CheckListItemFieldsProperties.checkList_id,
  })
  @IsString()
  checkList_id: string;

  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: CheckListItemFieldsProperties.created_at,
  })
  @IsDate()
  created_at?: Date;

  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: CheckListItemFieldsProperties.updated_at,
  })
  @IsDate()
  updated_at?: Date;

  @ApiProperty({
    description: CheckListItemFieldsProperties.company_id,
  })
  company_id?: number;
  @ApiProperty({
    description: "Nome do checklist",
  })
  @IsString()
  checklistName: string;

  @ApiProperty({
    description: "Nome da empresa vinculada ao checklist",
  })
  @IsString()
  companyName: string;

  @ApiProperty({
    description: "ID da empresa vinculada ao checklist",
  })
  companyId: string;

  @ApiProperty({
    description: "Se o checklist tem anomalias",
  })
  @IsBoolean()
  hasAnomalies: boolean;
}
export class CheckListForSpecificEmployee {
  @ApiProperty({
    description: "ID do checklist",
  })
  checklistItemId: string;

  @ApiProperty({
    description: "Nome do checklist",
  })
  @IsString()
  checklistName: string;
}
