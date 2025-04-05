import { ApiProperty } from "@nestjs/swagger";
import { CategoriesFieldsProperties } from "../enums";

export class Categories {
  @ApiProperty({ description: CategoriesFieldsProperties.id })
  id: string;

  @ApiProperty({ description: CategoriesFieldsProperties.name })
  name: string;

  @ApiProperty({ description: CategoriesFieldsProperties.created_at })
  created_at: Date;

  @ApiProperty({ description: CategoriesFieldsProperties.updated_at })
  updated_at: Date;
}
