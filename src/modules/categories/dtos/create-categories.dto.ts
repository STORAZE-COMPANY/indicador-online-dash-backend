import { IsString, IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { notBlankRegex } from "@shared/validations/annotationsValidations";
import { BaseMessagesValidations } from "@shared/enums";
import { CategoriesFieldsProperties } from "../enums";

export class CreateCategoriesDto {
  @ApiProperty({ description: CategoriesFieldsProperties.name })
  @IsString()
  @IsNotEmpty({ message: BaseMessagesValidations.notEmpty })
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  name: string;
}
