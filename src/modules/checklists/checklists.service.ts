import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CheckList,
  Checklist,
  CheckListQuestions,
} from "./entities/checklist.entity";
import { CreateCheckListDto } from "./dtos/create-checklist.dto";
import { UpdateChecklistDto } from "./dtos/update-checklist.dto";
import db from "database/connection";
import {
  CheckListFieldsProperties,
  CheckListQuestionFieldsProperties,
  CheckListResponseMessages,
} from "./enums/question-type.enum";

@Injectable()
export class ChecklistsService {
  async create(dto: CreateCheckListDto): Promise<CheckList> {
    return await db.transaction<CheckList>(async (trx) => {
      const [created] = await trx<CheckList>(
        CheckListFieldsProperties.tableName,
      )
        .insert({
          expiries_in: dto.expiries_in,
          categories_id: dto.categoriesId,
          name: dto.name,
        })
        .returning("*");

      const questions: CheckListQuestions[] = dto.question_list.map(
        (question) => ({
          ...question,
          checkList_id: created.id,
        }),
      );
      await trx<CheckListQuestions>(
        CheckListQuestionFieldsProperties.tableName,
      ).insert(questions);

      return created;
    });
  }

  async findAll(): Promise<Checklist[]> {
    const data = await db<Checklist>("checklists").select("*");

    return data.map((item) => ({
      ...item,
      categories: item.categories,
    }));
  }

  async findOne(id: number): Promise<Checklist> {
    const checklist = await db<Checklist>("checklists").where({ id }).first();

    if (!checklist) {
      throw new NotFoundException(CheckListResponseMessages.notFound);
    }

    return checklist;
  }

  async update(id: number, dto: UpdateChecklistDto): Promise<Checklist> {
    await this.findOne(id);
    const [updated] = await db<Checklist>("checklists")
      .where({ id })
      .update({
        name: dto.name,
        categories: dto.categories,
        updated_at: db.fn.now(),
      })
      .returning("*");

    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await db("checklists").where({ id }).del();
  }
}
