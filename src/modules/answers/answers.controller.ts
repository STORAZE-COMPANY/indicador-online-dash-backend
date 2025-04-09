import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";

import { BaseMessages } from "@shared/enums";
import { AnswerRoutes, AnswerSwaggerInfo } from "./enums";
import { Answers } from "./entities/asnwers.entity";
import { AnswersService } from "./answers.service";
import { CreateAnswerDto } from "./dtos/create-answer.dto";
import { QuestionId } from "./dtos/find-params.dto";

@Controller(AnswerRoutes.baseUrl)
@ApiTags(AnswerSwaggerInfo.tags)
export class AnswersController {
  constructor(private readonly service: AnswersService) {}

  @Get()
  @ApiOkResponse({
    type: [Answers],
  })
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  findList() {
    return this.service.findAllAnswers();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    type: Answers,
  })
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  @ApiUnprocessableEntityResponse({
    description: BaseMessages.requiredFields,
    type: UnprocessableEntityException,
  })
  async create(@Body() categoryDto: CreateAnswerDto): Promise<Answers> {
    return this.service.createAnswerForSingleQuestion({ ...categoryDto });
  }
  @Get(AnswerRoutes.getByQuestionId)
  @ApiOkResponse({
    type: [Answers],
  })
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  async findByQuestionId(@Query() params: QuestionId): Promise<Answers[]> {
    return this.service.findAnswerByQuestionId({ ...params });
  }
  @Post(AnswerRoutes.createAnswerForImageQuestion)
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    type: Answers,
  })
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  @ApiUnprocessableEntityResponse({
    description: BaseMessages.requiredFields,
    type: UnprocessableEntityException,
  })
  async createForImageQuestion(
    @Body() categoryDto: CreateAnswerDto,
  ): Promise<Answers> {
    return this.service.createAnswerForSingleQuestion({ ...categoryDto });
  }
}
