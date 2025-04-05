import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import { Categories } from "./entities/categories.entity";
import { CategoriesService } from "./categories.service";
import { BaseMessages } from "@shared/enums";
import { CategoriesRoutes, CategoriesSwaggerInfo } from "./enums";
import { CreateCategoriesDto } from "./dtos/create-categories.dto";

@Controller(CategoriesRoutes.baseUrl)
@ApiTags(CategoriesSwaggerInfo.tags)
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  @ApiOkResponse({
    type: [Categories],
  })
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  findList() {
    return this.service.findAllCategories();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    type: Categories,
  })
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  @ApiConflictResponse({
    description: BaseMessages.alreadyExists,
    type: ConflictException,
  })
  async create(@Body() categoryDto: CreateCategoriesDto): Promise<Categories> {
    return this.service.createCategory({ ...categoryDto });
  }
}
