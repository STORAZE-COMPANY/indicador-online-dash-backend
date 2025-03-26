import { Injectable, NotFoundException } from "@nestjs/common";
import { Checklist } from "./entities/checklist.entity";
import { CreateChecklistDto } from "./dtos/create-checklist.dto";
import { UpdateChecklistDto } from "./dtos/update-checklist.dto";

@Injectable()
export class ChecklistsService {
  private checklists: Checklist[] = [];
  private id = 1;

  create(dto: CreateChecklistDto): Checklist {
    const checklist: Checklist = {
      id: this.id++,
      name: dto.name,
      categories: dto.categories,
    };

    this.checklists.push(checklist);
    return checklist;
  }

  findAll(): Checklist[] {
    return this.checklists;
  }

  findOne(id: number): Checklist {
    const checklist = this.checklists.find((c) => c.id === id);
    if (!checklist) throw new NotFoundException("Checklist não encontrado");
    return checklist;
  }

  update(id: number, dto: UpdateChecklistDto): Checklist {
    const index = this.checklists.findIndex((c) => c.id === id);
    if (index === -1) throw new NotFoundException("Checklist não encontrado");

    const updated = { ...this.checklists[index], ...dto };
    this.checklists[index] = updated;
    return updated;
  }

  remove(id: number): void {
    const exists = this.checklists.some((c) => c.id === id);
    if (!exists) throw new NotFoundException("Checklist não encontrado");

    this.checklists = this.checklists.filter((c) => c.id !== id);
  }
}
