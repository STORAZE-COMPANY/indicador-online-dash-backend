import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  NotFoundException,
} from "@nestjs/common";
import { ChecklistsService } from "./checklists.service";
import { CreateCheckListDto } from "./dtos/create-checklist.dto";
import { UpdateChecklistDto } from "./dtos/update-checklist.dto";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CheckList, Checklist } from "./entities/checklist.entity";
import { CheckListResponseMessages } from "./enums/question-type.enum";

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
  create(@Body() dto: CreateCheckListDto) {
    return this.service.create(dto);
  }

  /**
   * Retorna todos os checklists.
   * @returns Uma lista de checklists.
   */
  @Get()
  @ApiOkResponse({
    type: [Checklist],
  })
  findAll() {
    return this.service.findAll();
  }

  /**
   * Retorna um checklist específico pelo ID.
   * @param id ID do checklist a ser buscado.
   * @returns O checklist correspondente ao ID fornecido.
   * @throws NotFoundException Caso o checklist não seja encontrado.
   */
  @Get(":id")
  @ApiOkResponse({
    type: [Checklist],
  })
  @ApiNotFoundResponse({
    description: CheckListResponseMessages.notFound,
    type: NotFoundException,
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  /**
   * Atualiza um checklist existente.
   * @param id ID do checklist a ser atualizado.
   * @param dto Dados para atualização do checklist.
   * @returns O checklist atualizado.
   * @throws NotFoundException Caso o checklist não seja encontrado.
   */
  @Put(":id")
  @ApiOkResponse({
    type: Checklist,
  })
  @ApiNotFoundResponse({
    description: CheckListResponseMessages.notFound,
    type: NotFoundException,
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateChecklistDto,
  ) {
    return this.service.update(id, dto);
  }

  /**
   * Remove um checklist existente.
   * @param id ID do checklist a ser removido.
   * @returns Confirmação da remoção.
   * @throws NotFoundException Caso o checklist não seja encontrado.
   */
  @Delete(":id")
  @ApiOkResponse()
  @ApiNotFoundResponse({
    description: CheckListResponseMessages.notFound,
    type: NotFoundException,
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
