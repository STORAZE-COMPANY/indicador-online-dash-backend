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
import { BaseMessages } from "@shared/enums";
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

  async create({
    company_id,
    email,
    name,
    phone,
  }: CreateEmployeeDto): Promise<CreateEmployeeResponse> {
    const emailAlreadyExists = await db<Employee>("employees")
      .where({ email })
      .first();
    if (emailAlreadyExists)
      throw new ConflictException(BaseMessages.emailAlreadyExists);
    const harshPassword = await bcrypt.hash(
      this.generateRandomCode().toString(),
      8,
    );
    const [created] = await db<Employee>("employees")
      .insert({
        company_id,
        email,
        name,
        phone,
        password: harshPassword,
      })
      .returning(["id", "company_id", "email", "name", "phone"]);

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

  generateRandomCode = () => {
    return Math.random().toString().slice(2, 10); // Gera um número aleatório e pega os 8 primeiros dígitos
  };
}
