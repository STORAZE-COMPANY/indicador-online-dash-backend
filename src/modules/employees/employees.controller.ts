import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Query,
} from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto } from "./dtos/create-employee.dto";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { BaseMessages } from "@shared/enums";
import { CreateEmployeeResponse, Employee } from "./entities/employee.entity";
import { FindParamsDto } from "./dtos/find-params.dto";

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

  @Get()
  @ApiOkResponse({
    type: Employee,
  })
  findList(@Query() { query, limit, page }: FindParamsDto) {
    return this.service.findList({
      query,
      limit: Number(limit),
      page: Number(page),
    });
  }
}
