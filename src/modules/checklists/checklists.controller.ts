import {
  Controller,
  Post,
  Body,
  UseGuards,
  Query,
  Get,
  Put,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ChecklistsService } from "./checklists.service";
import { CreateCheckListDto } from "./dtos/create-checklist.dto";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { CheckList } from "./entities/checklist.entity";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import {
  CheckListByEmployee,
  CheckListItemFormattedList,
} from "./dtos/check_list_item.dto";
import { employeeIdDto, FindParamsDto } from "./dtos/find-params.dto";
import {
  UpdateChecklistDto,
  UpdateCompanyRelated,
  updateExpiriesTime,
} from "./dtos/update-checklist.dto";
import { CheckListItem } from "./entities/checkListItem.entity";
import { GroupedCheckList } from "./interfaces/checklist.interface";
import { BatchConnectCompanyToChecklistDto } from "./dtos/batch.dto";
import { BaseMessages } from "@shared/enums";
import { CheckListDto } from "./dtos/find.dto";

/**
 * Controlador responsável por gerenciar as operações relacionadas aos checklists.
 */
@Controller("checklists")
@ApiTags("Checklists")
export class ChecklistsController {
  /**
   * Construtor do controlador de checklists.
   * @param service Serviço responsável pelas operações de checklist.
   */
  constructor(private readonly service: ChecklistsService) {}

  /**
   * Cria um novo checklist.
   * @param dto Dados para criação do checklist.
   * @returns O checklist criado.
   */
  @Post()
  @ApiCreatedResponse({
    type: CheckList,
  })
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCheckListDto) {
    return this.service.create(dto);
  }

  /**
   * Encontra checklists paginados com base nos parâmetros fornecidos.
   * @param dto Parâmetros de busca para os checklists.
   * @returns Lista de checklists formatados.
   */

  @Get()
  @ApiOkResponse({
    type: [CheckListItemFormattedList],
  })
  findPaginatedByParams(
    @Query() dto: FindParamsDto,
  ): Promise<CheckListItemFormattedList[]> {
    return this.service.findPaginatedByParams({
      ...dto,
      byCompany: dto.byCompany && Number(dto.byCompany),
    });
  }
  @Get("all")
  @ApiOkResponse({
    type: [CheckListDto],
  })
  findAll(): Promise<CheckListDto[]> {
    return this.service.findAll();
  }
  @Get("checkListWithCompanies")
  @ApiOkResponse({
    type: [GroupedCheckList],
  })
  findCheckListPaginatedByParams(
    @Query() dto: FindParamsDto,
  ): Promise<GroupedCheckList[]> {
    return this.service.findPaginatedCheckList({
      ...dto,
      byCompany: dto.byCompany && Number(dto.byCompany),
    });
  }

  @Get("by-employee")
  @ApiOkResponse({
    type: [CheckListByEmployee],
  })
  /**
   * Retorna uma lista paginada de checklists associados a um funcionário específico.
   *
   * @param dto - Objeto contendo o ID do funcionário (`employeeId`) para o qual os checklists serão buscados.
   * @returns Uma Promise que resolve para um array de checklists relacionados ao funcionário especificado.
   */
  findPaginatedByEmployeeParams(
    @Query() dto: employeeIdDto,
  ): Promise<CheckListByEmployee[]> {
    return this.service.findPaginatedByEmployeeResponsible({
      employeeId: dto.employeeId,
    });
  }

  @Put("update-company-related")
  @ApiNotFoundResponse({
    description: "ChecklistItem não encontrado",
    type: NotFoundException,
  })
  @ApiOkResponse({
    type: CheckListItem,
  })
  updateCompanyId(@Body() dto: UpdateCompanyRelated) {
    return this.service.updateCompanyRelated({
      companies_id: dto.companyId,
      checkListItemId: dto.checkListItemId,
    });
  }

  @Put("update-expiries-time")
  @ApiNotFoundResponse({
    description: "Checklist não encontrado",
    type: NotFoundException,
  })
  @ApiOkResponse({
    type: CheckList,
  })
  updateExpiriesTime(@Body() dto: updateExpiriesTime) {
    return this.service.updateExpiriesTime({
      expiries_in: dto.expiriesTime,
      checkListId: dto.checkListId,
      images_expiries_in: dto.imagesExpiriesTime,
    });
  }

  @Post("connect-checklist-company")
  @ApiBody({
    type: [BatchConnectCompanyToChecklistDto],
  })
  @ApiUnprocessableEntityResponse({
    description: BaseMessages.alreadyExists,
    type: UnprocessableEntityException,
  })
  connectCheckListToCompany(@Body() dto: BatchConnectCompanyToChecklistDto[]) {
    return this.service.updateCompanyRelatedBatch(dto);
  }

  @Put()
  @ApiNotFoundResponse({
    description: BaseMessages.notFound,
    type: NotFoundException,
  })
  @ApiOkResponse({
    type: CheckList,
  })
  updateCheckListName(@Body() dto: UpdateChecklistDto) {
    return this.service.updateCheckList({
      ...dto,
    });
  }
}
