import { Injectable, NotFoundException } from "@nestjs/common";
import { Company } from "./entities/company.entity";
import { CreateCompanyDto } from "./dtos/create-company.dto";
import { UpdateCompanyDto } from "./dtos/update-company.dto";
import db from "database/connection";

@Injectable()
export class CompaniesService {
  async findAll(): Promise<Company[]> {
    return db<Company>("companies").select("*");
  }

  async findOne(id: number): Promise<Company> {
    const company = await db<Company>("companies").where({ id }).first();
    if (!company) throw new NotFoundException("Empresa não encontrada");
    return company;
  }

  async create(dto: CreateCompanyDto): Promise<Company> {
    const [created] = await db<Company>("companies")
      .insert({
        name: dto.name,
        cnpj: dto.cnpj,
        isActive: dto.isActive,
        checklistIds: db.raw("?::jsonb", [JSON.stringify(dto.checklistIds)]),
      })
      .returning("*");

    return created;
  }

  async update(id: number, dto: UpdateCompanyDto): Promise<Company> {
    const [updated] = await db<Company>("companies")
      .where({ id })
      .update({
        name: dto.name,
        cnpj: dto.cnpj,
        isActive: dto.isActive,
        checklistIds: db.raw("?::jsonb", [JSON.stringify(dto.checklistIds)]),
        updated_at: db.fn.now(),
      })
      .returning("*");

    if (!updated) throw new NotFoundException("Empresa não encontrada");
    return updated;
  }

  async remove(id: number): Promise<void> {
    const deleted = await db("companies").where({ id }).del();
    if (!deleted) throw new NotFoundException("Empresa não encontrada");
  }
}
