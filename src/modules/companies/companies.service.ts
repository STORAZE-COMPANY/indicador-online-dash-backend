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
import * as bcrypt from "bcryptjs";
import { BaseMessages, smtpMessages } from "@shared/enums";
import {
  CompanyResponse,
  FindCompanySettings,
} from "./dtos/response-company.dto";
import { UpdateCompanySettingsDto } from "./dtos/update-company-settings.dto";
import { CompanySettings } from "./entities/companySettings.entity";
import { buildFindCompanySettingsQuery } from "./aux";
import { sendEmail } from "@modules/employees/smtp";
import { buildHtmlTemplateForPassword } from "@modules/employees/smtp/aux/html-template";

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

  async create(dto: CreateCompanyDto): Promise<CompanyResponse> {
    const companyCnpjExist = await db<Company>("companies")
      .where({ cnpj: dto.cnpj })
      .first();
    if (companyCnpjExist)
      throw new ConflictException(CompaniesResponseMessages.cnpjAlreadyExists);
    const randomCode = this.generateRandomCode().toString();
    const harshPassword = await bcrypt.hash(randomCode, 8);

    const [created] = await db<Company>("companies")
      .insert({
        name: dto.name,
        cnpj: dto.cnpj,

        isActive: dto.isActive,
        password: harshPassword,
        email: dto.email,
      })
      .returning(["id", "cnpj", "email", "name", "isActive"]);
    if (created) {
      await sendEmail({
        to: dto.email,
        subject: smtpMessages.welcome,
        text: "",
        html: buildHtmlTemplateForPassword(randomCode),
      });
    }
    return created;
  }

  async update(dto: UpdateCompanyDto): Promise<CompanyResponse> {
    const { id, ...company } = dto;
    const companyExist = await db<Company>("companies")
      .select("id")
      .where({ id })
      .first();

    if (!companyExist) {
      throw new NotFoundException(CompaniesResponseMessages.notFound);
    }
    const [existingCnpj, existingEmail] = await Promise.all([
      company.cnpj
        ? db<Company>("companies")
            .select("id")
            .where({ cnpj: company.cnpj })
            .whereNot({ id })
            .first()
        : null,
      company.email
        ? db<Company>("companies")
            .select("id")
            .where({ email: company.email })
            .whereNot({ id })
            .first()
        : null,
    ]);

    if (existingCnpj) {
      throw new ConflictException(CompaniesResponseMessages.cnpjAlreadyExists);
    }

    if (existingEmail) {
      throw new ConflictException(BaseMessages.emailAlreadyExists);
    }

    const [updated] = await db<Company>("companies")
      .update({
        ...company,
      })
      .where({ id })
      .returning(["id", "cnpj", "email", "name", "isActive"]);

    return updated;
  }

  async updateSettings(
    dto: UpdateCompanySettingsDto,
  ): Promise<CompanySettings> {
    const { company_id, ...settings } = dto;
    const companyExist = await db<Company>("companies")
      .select("id")
      .where({ id: company_id })
      .first();

    if (!companyExist) {
      throw new NotFoundException(CompaniesResponseMessages.notFound);
    }

    const [updated] = await db<CompanySettings>("companySettings")
      .insert({
        company_id,
        ...settings,
      })
      .onConflict("company_id")
      .merge()
      .returning("*");

    return updated;
  }

  async getSettings(): Promise<FindCompanySettings[]> {
    const companies: FindCompanySettings[] =
      await buildFindCompanySettingsQuery(
        db<CompanySettings>("companySettings"),
      ).select(["companySettings.*", "companies.name as companyName"]);

    return companies;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await db("companies")
      .update({
        isActive: false,
      })
      .where({ id });
  }
  generateRandomCode = () => {
    return Math.random().toString().slice(2, 10);
  };
}
