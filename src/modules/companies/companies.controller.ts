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
  ConflictException,
  UseGuards,
} from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { UpdateCompanyDto } from "./dtos/update-company.dto";
import { CreateCompanyDto } from "./dtos/create-company.dto";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Company } from "./entities/company.entity";
import { CompaniesResponseMessages } from "./enums";
import { BaseMessages } from "@shared/enums";
import { CompanyResponse } from "./dtos/response-company.dto";
import { UpdateCompanySettingsDto } from "./dtos/update-company-settings.dto";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";

/**
 * Controlador responsável por gerenciar as operações relacionadas às empresas.
 */
@Controller("companies")
@ApiTags("Companies")
export class CompaniesController {
  /**
   * Construtor do controlador de empresas.
   * @param service Serviço responsável pelas operações de empresas.
   */
  constructor(private readonly service: CompaniesService) {}

  /**
   * Retorna uma lista de todas as empresas.
   * @returns Lista de empresas.
   */
  @Get()
  @ApiOkResponse({ type: [Company] })
  findAll() {
    return this.service.findAll();
  }

  /**
   * Retorna os detalhes de uma empresa específica.
   * @param id Identificador único da empresa.
   * @returns Detalhes da empresa.
   * @throws NotFoundException Se a empresa não for encontrada.
   */
  @Get(":id")
  @ApiOkResponse({ type: Company })
  @ApiNotFoundResponse({
    description: CompaniesResponseMessages.notFound,
    type: NotFoundException,
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  /**
   * Cria uma nova empresa.
   * @param dto Dados para criação da empresa.
   * @returns Empresa criada.
   * @throws ConflictException Se o CNPJ já existir.
   */
  @Post()
  @ApiCreatedResponse({
    type: CompanyResponse,
  })
  @ApiConflictResponse({
    description: CompaniesResponseMessages.cnpjAlreadyExists,
    type: ConflictException,
  })
  create(@Body() dto: CreateCompanyDto) {
    return this.service.create(dto);
  }

  @Put()
  @ApiOkResponse({
    type: CompanyResponse,
  })
  @ApiNotFoundResponse({
    description: CompaniesResponseMessages.notFound,
    type: NotFoundException,
  })
  @ApiResponse({
    status: 409,
    description: `${CompaniesResponseMessages.cnpjAlreadyExists} ou ${BaseMessages.emailAlreadyExists}`,
    type: ConflictException,
  })
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UpdateCompanyDto) {
    return this.service.update(dto);
  }

  /**
   * Remove uma empresa existente.
   * @param id Identificador único da empresa.
   * @returns Confirmação da remoção.
   * @throws NotFoundException Se a empresa não for encontrada.
   */
  @Delete(":id")
  @ApiOkResponse()
  @ApiNotFoundResponse({
    description: CompaniesResponseMessages.notFound,
    type: NotFoundException,
  })
  @UseGuards(JwtAuthGuard)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post("settings")
  @ApiCreatedResponse({
    type: CompanyResponse,
  })
  @ApiOkResponse({
    type: CompanyResponse,
  })
  @UseGuards(JwtAuthGuard)
  @ApiNotFoundResponse({
    description: CompaniesResponseMessages.notFound,
    type: NotFoundException,
  })
  updateCompanySettings(@Body() dto: UpdateCompanySettingsDto) {
    return this.service.updateSettings({ ...dto });
  }
}
