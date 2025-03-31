import { Body, ConflictException, Controller, Post } from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto } from "./dtos/create-employee.dto";
import { ApiConflictResponse, ApiCreatedResponse } from "@nestjs/swagger";
import { BaseMessages } from "@shared/enums";
import { CreateEmployeeResponse } from "./entities/employee.entity";

@Controller("employees")
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  @Post()
  @ApiCreatedResponse({
    type: CreateEmployeeResponse,
  })
  @ApiConflictResponse({
    description: BaseMessages.alreadyExists,
    type: ConflictException,
  })
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }
}
