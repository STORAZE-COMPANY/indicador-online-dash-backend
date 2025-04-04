import { Injectable, NotFoundException } from "@nestjs/common";
import { CheckList, Checklist } from "./entities/checklist.entity";
import { CreateCheckListDto } from "./dtos/create-checklist.dto";
import { UpdateChecklistDto } from "./dtos/update-checklist.dto";
import db from "database/connection";

import { BaseMessages } from "@shared/enums";
import { CheckListFieldsProperties } from "./enums/checkList.enum";

import {
  handleBuildChoicesToInsert,
  handleBuildQuestionsToInsert,
  handleCreateCheckListItem,
  handleCreateMultipleChoice,
  handleCreateQuestion,
} from "./auxliar/auxiliar.func";

@Injectable()
export class ChecklistsService {
  async create(dto: CreateCheckListDto): Promise<CheckList> {
    return await db.transaction<CheckList>(async (trx) => {
      const [created] = await trx<CheckList>(
        CheckListFieldsProperties.tableName,
      )
        .insert({
          expiries_in: dto.expiries_in,

          name: dto.name,
        })
        .returning("*");

      const checkListItemCreated = await handleCreateCheckListItem(
        dto.checkListItem.map((item) => ({
          categories_id: item.categoriesId,
          checkList_id: created.id,
        })),
        trx,
      );
      const allQuestionsToInsert = handleBuildQuestionsToInsert(
        dto.checkListItem,
        checkListItemCreated,
      );

      const questionsCreated = await handleCreateQuestion(
        allQuestionsToInsert,
        trx,
      );

      if (questionsCreated.some((item) => item.type === "Múltipla escolha")) {
        const choicesToInsert = handleBuildChoicesToInsert(
          dto.checkListItem.map((item) => item.question_list).flat(),
          questionsCreated,
        );

        await handleCreateMultipleChoice(choicesToInsert, trx);
      }

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
      throw new NotFoundException(BaseMessages.notFound);
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
