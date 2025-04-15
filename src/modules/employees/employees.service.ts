import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import * as bcrypt from "bcryptjs";
import { CreateEmployeeResponse, Employee } from "./entities/employee.entity";
import { CreateEmployeeDto } from "./dtos/create-employee.dto";
import db from "database/connection";
import { EmployeesResponseMessages } from "./enums";
import { BaseMessages, smtpMessages } from "@shared/enums";
import { BasePaginationParams } from "./interfaces";
import { Knex } from "knex";
import { EmployeeListDto } from "./dtos/list-employee.dto";
import { UpdateEmployeeDto } from "./dtos/update-employee.dto";
import { sendEmail } from "./smtp";
import { buildHtmlTemplateForPassword } from "./smtp/aux/html-template";
// import { sendEmail } from "./smtp";

@Injectable()
export class EmployeesService {
  async findByWhereOne(where: Partial<Employee>): Promise<Employee> {
    const employee = await db<Employee>("employees")
      .where({ ...where })
      .first();

    if (!employee)
      throw new NotFoundException(EmployeesResponseMessages.notFound);
    return employee;
  }

  async findList({
    query,
    limit,
    page,
  }: BasePaginationParams): Promise<EmployeeListDto[]> {
    const offset = (page - 1) * limit;
    return await db<Employee>("employees")
      .join("roles", "employees.role_id", "roles.id")
      .join("companies", "employees.company_id", "companies.id")
      .where(this.generateWhereBuilder(query))
      .limit(limit)
      .offset(offset)
      .orderBy("name")
      .select(
        "employees.id",
        "employees.name",
        "employees.email",
        "employees.phone",
        "employees.company_id",
        "roles.name as role_name",
        "companies.name as company_name",
      );
  }

  async create({
    company_id,
    email,
    name,
    phone,
    roleId,
  }: CreateEmployeeDto): Promise<CreateEmployeeResponse> {
    const emailAlreadyExists = await db<Employee>("employees")
      .where({ email })
      .first();
    if (emailAlreadyExists)
      throw new ConflictException(BaseMessages.emailAlreadyExists);
    const randomCode = this.generateRandomCode().toString();
    const harshPassword = await bcrypt.hash(randomCode, 8);
    const [created] = await db<Employee>("employees")
      .insert({
        company_id,
        email,
        name,
        phone,
        role_id: roleId,
        password: harshPassword,
      })
      .returning(["id", "company_id", "email", "name", "phone", "role_id"]);

    if (created) {
      await sendEmail({
        to: email,
        subject: smtpMessages.welcome,
        text: "",
        html: buildHtmlTemplateForPassword(randomCode),
      });
    }

    return created;
  }

  async update(employeeUpdate: UpdateEmployeeDto): Promise<Employee> {
    const { id, ...employee } = employeeUpdate;

    const employeeExists = await db<Employee>("employees")
      .where({ id })
      .first();

    if (!employeeExists) throw new NotFoundException(BaseMessages.notFound);

    if (employee.email) {
      const emailAlreadyExists = await db<Employee>("employees")
        .where({ email: employee.email })
        .andWhereNot({ id })
        .first();

      if (emailAlreadyExists) {
        throw new ConflictException(BaseMessages.emailAlreadyExists);
      }
    }

    const [employeeUpdated] = await db<Employee>("employees")
      .update({
        ...employee,
      })
      .where({ id })
      .returning("*");

    return employeeUpdated;
  }

  generateRandomCode = () => {
    return Math.random().toString().slice(2, 10); // Gera um número aleatório e pega os 8 primeiros dígitos
  };
  generateWhereBuilder = (query?: string) => {
    return (builder: Knex.QueryBuilder<Employee>) => {
      if (query) {
        builder.where("name", "ilike", `%${query}%`);
        builder.orWhere("email", "ilike", `%${query}%`);
      }
    };
  };
}
