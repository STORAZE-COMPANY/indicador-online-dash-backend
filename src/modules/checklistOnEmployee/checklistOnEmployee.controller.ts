import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";

import { BaseMessages } from "@shared/enums";
import { ChecklistOnEmployeeRoutes } from "./enums";
import { ChecklistOnEmployeeService } from "./checklistOnEmployee.service";
import { checklistOnEmployeeCreateDto } from "./dtos/create.dto";
import { checklistOnEmployee } from "./entities/checklistOnEmployee.entity";
import { CheckListForSpecificEmployee } from "./dtos/responses.dto";
import { FindByEmployee } from "./dtos/find-params.dto";
import { checklistOnEmployeeUpdateDto } from "./dtos/update.dto";
import { checklistsWithQuestionsGrouped } from "./interfaces";

@Controller(ChecklistOnEmployeeRoutes.base)
@ApiTags(ChecklistOnEmployeeRoutes.tags)
export class ChecklistOnEmployeeController {
  constructor(private readonly service: ChecklistOnEmployeeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    type: checklistOnEmployee,
  })
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  @ApiConflictResponse({
    description: BaseMessages.alreadyExists,
    type: UnprocessableEntityException,
  })
  async create(
    @Body() dto: checklistOnEmployeeCreateDto,
  ): Promise<checklistOnEmployee> {
    return this.service.connectCheckListOnEmployee({ ...dto });
  }

  @Get("by-employee")
  @ApiOkResponse({
    type: [CheckListForSpecificEmployee],
  })
  findPaginatedByEmployeeParams(
    @Query() dto: FindByEmployee,
  ): Promise<CheckListForSpecificEmployee[]> {
    return this.service.findPaginatedByEmployeeResponsible({
      employeeId: dto.employeeId,
    });
  }
  @Get("by-employee-answers")
  @ApiOkResponse({
    type: [checklistsWithQuestionsGrouped],
  })
  findChecklistAnswersEmployeeParams(
    @Query("employeeId") employeeId: number,
  ): Promise<checklistsWithQuestionsGrouped[]> {
    return this.service.answerChecklistOnEmployee({
      employeeId: Number(employeeId),
    });
  }
  @Put()
  @ApiOkResponse({
    type: checklistOnEmployee,
  })
  @ApiNotFoundResponse({
    description: BaseMessages.notFound,
    type: ApiNotFoundResponse,
  })
  update(
    @Body() dto: checklistOnEmployeeUpdateDto,
  ): Promise<checklistOnEmployee> {
    return this.service.updateChecklistOnEmployee({ ...dto });
  }
  @Delete()
  @ApiOkResponse({
    type: checklistOnEmployee,
  })
  @ApiNotFoundResponse({
    description: BaseMessages.notFound,
    type: ApiNotFoundResponse,
  })
  delete(
    @Body() dto: checklistOnEmployeeCreateDto,
  ): Promise<checklistOnEmployee> {
    return this.service.deleteChecklistOnEmployee(dto);
  }
}
