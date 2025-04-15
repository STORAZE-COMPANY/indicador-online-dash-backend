import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto } from "./dtos/create-employee.dto";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { BaseMessages } from "@shared/enums";
import { CreateEmployeeResponse, Employee } from "./entities/employee.entity";
import { FindParamsDto } from "./dtos/find-params.dto";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import { EmployeeListDto } from "./dtos/list-employee.dto";
import { UpdateEmployeeDto } from "./dtos/update-employee.dto";
import { sendEmail } from "./smtp";
import { buildHtmlTemplateForPassword } from "./smtp/aux/html-template";

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
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOkResponse({
    type: [EmployeeListDto],
  })
  @UseGuards(JwtAuthGuard)
  findList(@Query() { query, limit, page }: FindParamsDto) {
    return this.service.findList({
      query,
      limit: Number(limit),
      page: Number(page),
    });
  }

  @Put()
  @ApiOkResponse({
    type: Employee,
  })
  @ApiConflictResponse({
    description: BaseMessages.alreadyExists,
    type: ConflictException,
  })
  @ApiNotFoundResponse({
    description: BaseMessages.notFound,
  })
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UpdateEmployeeDto): Promise<Employee> {
    return this.service.update(dto);
  }

  @Get("send-email")
  async sendEmail(@Query("email") email: string) {
    await sendEmail({
      subject: "Test",
      text: "Test",
      to: email,
      html: buildHtmlTemplateForPassword("123456"),
    });
  }
}
