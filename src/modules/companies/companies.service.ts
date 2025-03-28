import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Company } from "./entities/company.entity";
import { CreateCompanyDto } from "./dtos/create-company.dto";
import { UpdateCompanyDto } from "./dtos/update-company.dto";
import db from "database/connection";
import { CompaniesResponseMessages } from "./enums";

@Injectable()
export class CompaniesService {
  async findAll(): Promise<Company[]> {
    return await db<Company>("companies").select("*");
  }

  async findOne(id: number): Promise<Company> {
    const company = await db<Company>("companies").where({ id }).first();
    if (!company)
      throw new NotFoundException(CompaniesResponseMessages.notFound);
    return company;
  }

  async create(dto: CreateCompanyDto): Promise<Company> {
    const companyCnpjExist = await db<Company>("companies")
      .where({ cnpj: dto.cnpj })
      .first();
    if (companyCnpjExist)
      throw new ConflictException(CompaniesResponseMessages.cnpjAlreadyExists);
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
    await this.findOne(id);
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

    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await db("companies").where({ id }).del();
  }
}
