import { ConflictException, Injectable } from "@nestjs/common";

import db from "database/connection";
import { Categories } from "@modules/categories/entities/categories.entity";
import { CreateCategoriesDto } from "./dtos/create-categories.dto";
import { BaseMessages } from "@shared/enums";
import { CategoriesFieldsProperties } from "./enums";

@Injectable()
export class CategoriesService {
  async findAllCategories(): Promise<Categories[]> {
    return await db<Categories>(CategoriesFieldsProperties.tableName);
  }

  async createCategory({ name }: CreateCategoriesDto): Promise<Categories> {
    const existingCategory = await db<Categories>("categories")
      .where({ name })
      .first();

    if (existingCategory)
      throw new ConflictException(BaseMessages.alreadyExists);

    const [category] = await db<Categories>(
      CategoriesFieldsProperties.tableName,
    )
      .insert({ name })
      .returning("*");
    return category;
  }
}
