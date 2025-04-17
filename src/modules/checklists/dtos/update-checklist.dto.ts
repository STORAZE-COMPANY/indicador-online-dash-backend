import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import { CheckListItemFieldsProperties } from "../enums/checkListItem.enum";
import { CheckListFieldsProperties } from "../enums/checkList.enum";

export class UpdateChecklistDto {
  @IsNonBlankString({ isOptional: false })
  @ApiProperty({
    description: CheckListFieldsProperties.id,
  })
  checkListId: string;

  @ApiPropertyOptional({
    example: "Checklist de Segurança",
    description: "Nome do checklist",
  })
  @IsString()
  @IsOptional()
  name: string;
}

export class UpdateCompanyRelated {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: "ID da empresa",
  })
  companyId: number;

  @IsNonBlankString({ isOptional: false })
  @ApiProperty({
    description: CheckListItemFieldsProperties.id,
  })
  checkListItemId: string;
}
export class updateExpiriesTime {
  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: CheckListFieldsProperties.expiries_in,
  })
  @IsNonBlankString({ isOptional: false })
  expiriesTime: string;

  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: CheckListFieldsProperties.image_expiries_in,
  })
  @IsNonBlankString({ isOptional: true })
  imagesExpiriesTime?: string;

  @IsNonBlankString({ isOptional: false })
  @ApiProperty({
    description: CheckListItemFieldsProperties.id,
  })
  checkListId: string;
}
export class UpdateChecklistItemDto {
  @IsNonBlankString({ isOptional: false })
  @ApiProperty({
    description: CheckListFieldsProperties.id,
  })
  checkListItemId: string;

  @ApiPropertyOptional({
    description: "ID da categoria",
  })
  @IsString()
  @IsOptional()
  categoryId: string;
}
