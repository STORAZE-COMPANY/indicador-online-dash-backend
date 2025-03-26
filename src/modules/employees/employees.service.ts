import { Injectable, NotFoundException } from "@nestjs/common";

import * as bcrypt from "bcryptjs";
import { Employee } from "./entities/employee.entity";
import { CreateEmployeeDto } from "./dtos/create-employee.dto";
import { UpdateEmployeeDto } from "./dtos/update-employee.dto";

@Injectable()
export class EmployeesService {
  private employees: Employee[] = [];
  private id = 1;

  findAll(): Employee[] {
    return this.employees;
  }

  findOne(id: number): Employee {
    const employee = this.employees.find((e) => e.id === id);
    if (!employee) throw new NotFoundException("Funcionário não encontrado");
    return employee;
  }

  create(dto: CreateEmployeeDto): Employee {
    const hashedPassword = bcrypt.hashSync(dto.password, 10);

    const employee: Employee = {
      id: this.id++,
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      companyId: dto.companyId,
    };

    this.employees.push(employee);
    return employee;
  }

  update(id: number, dto: UpdateEmployeeDto): Employee {
    const employee = this.findOne(id);
    const index = this.employees.findIndex((e) => e.id === id);
    const updated = {
      ...employee,
      ...dto,
      password: dto.password
        ? bcrypt.hashSync(dto.password, 10)
        : employee.password,
    };
    this.employees[index] = updated;
    return updated;
  }

  remove(id: number): void {
    this.findOne(id); // valida existência
    this.employees = this.employees.filter((e) => e.id !== id);
  }
}
