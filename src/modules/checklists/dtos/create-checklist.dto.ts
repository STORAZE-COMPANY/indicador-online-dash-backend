import { IsNotEmpty, IsString, Matches } from "class-validator";
import { CheckListFieldsProperties } from "../enums/question-type.enum";
import { ApiProperty } from "@nestjs/swagger";
import { BaseMessagesValidations } from "@shared/enums";
import { notBlankRegex } from "@shared/validations/annotationsValidations";
import { CreateCheckListItemDto } from "./check_list_item.dto";

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
    example: "2023-10-01T00:00:00.000Z",
    description: CheckListFieldsProperties.expiries_in,
  })
  @IsString()
  expiries_in: Date;

  @ApiProperty({
    description: CheckListFieldsProperties.categories_id,
  })
  @IsString()
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  @IsNotEmpty({ message: BaseMessagesValidations.notEmpty })
  categoriesId: string;

  @ApiProperty({
    description: CheckListFieldsProperties.checkListItem,
  })
  checkListItem: CreateCheckListItemDto;
}
