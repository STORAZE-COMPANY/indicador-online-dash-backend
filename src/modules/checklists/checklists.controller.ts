import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ChecklistsService } from "./checklists.service";
import { CreateCheckListDto } from "./dtos/create-checklist.dto";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { CheckList } from "./entities/checklist.entity";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";

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
}
