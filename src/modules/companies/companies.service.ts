import { Injectable, NotFoundException } from "@nestjs/common";
import { Company } from "./entities/company.entity";
import { CreateCompanyDto } from "./dtos/create-company.dto";
import { UpdateCompanyDto } from "./dtos/update-company.dto";

@Injectable()
export class CompaniesService {
  private companies: Company[] = [];
  private id = 1;

  findAll(): Company[] {
    return this.companies;
  }

  findOne(id: number): Company {
    const company = this.companies.find((c) => c.id === id);
    if (!company) throw new NotFoundException("Empresa não encontrada");
    return company;
  }

  create(dto: CreateCompanyDto): Company {
    const company: Company = {
      id: this.id++,
      ...dto,
    };
    this.companies.push(company);
    return company;
  }

  update(id: number, dto: UpdateCompanyDto): Company {
    const company = this.findOne(id);
    const index = this.companies.findIndex((c) => c.id === id);
    const updated = { ...company, ...dto };
    this.companies[index] = updated;
    return updated;
  }

  remove(id: number): void {
    this.findOne(id); // valida existência
    this.companies = this.companies.filter((c) => c.id !== id);
  }
}
