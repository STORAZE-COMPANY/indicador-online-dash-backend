import { Injectable, NotFoundException } from "@nestjs/common";
import { Checklist } from "./entities/checklist.entity";
import { CreateChecklistDto } from "./dtos/create-checklist.dto";
import { UpdateChecklistDto } from "./dtos/update-checklist.dto";
import db from "database/connection";
import { CheckListResponseMessages } from "./enums/question-type.enum";

@Injectable()
export class ChecklistsService {
  async create(dto: CreateChecklistDto): Promise<Checklist> {
    const categoriesJson = JSON.stringify(dto.categories);

    const [created] = await db<Checklist>("checklists")
      .insert({
        name: dto.name,
        categories: db.raw("?::jsonb", [categoriesJson]),
      })
      .returning("*");

    return created;
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
