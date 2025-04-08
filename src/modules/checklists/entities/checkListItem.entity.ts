import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDate } from "class-validator";
import { CheckListItemFieldsProperties } from "../enums/checkListItem.enum";
export class CheckListItem {
  @ApiProperty({ description: CheckListItemFieldsProperties.id })
  @IsString()
  id: string;

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
}
