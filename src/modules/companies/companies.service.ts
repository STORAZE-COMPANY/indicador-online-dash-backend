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

    const harshPassword = await bcrypt.hash(
      this.generateRandomCode().toString(),
      8,
    );

    const [created] = await db<Company>("companies")
      .insert({
        name: dto.name,
        cnpj: dto.cnpj,
        role_id: dto.roleId,
        isActive: dto.isActive,
        password: harshPassword,
        email: dto.email,
      })
      .returning("*");
    {
      /*  TODO: Implementar envio de email SMTP
      if (created) {
         await sendEmail({
           to: email,
           subject: EmployeesResponseMessages.welcome,
           text: EmployeesResponseMessages.yourPassword + harshPassword,
         });
       }
      */
    }
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
        updated_at: db.fn.now(),
      })
      .returning("*");

    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await db("companies").where({ id }).del();
  }
  generateRandomCode = () => {
    return Math.random().toString().slice(2, 10);
  };
}
