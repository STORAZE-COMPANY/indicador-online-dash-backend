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
import { CreateCheckListItemDto } from "./check_list_item.dto";
import { CheckListFieldsProperties } from "@modules/checklists/enums/checkList.enum";
import { Type } from "class-transformer";
import { checkListItemExample } from "@modules/checklists/dtos/constants/examplesForSwagger/checkListItem";

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
    type: [CreateCheckListItemDto],
    description: CheckListFieldsProperties.checkListItem,
    example: checkListItemExample,
  })
  @Type(() => CreateCheckListItemDto)
  @ValidateNested({ each: true })
  @IsArray()
  checkListItem: CreateCheckListItemDto[];
}
