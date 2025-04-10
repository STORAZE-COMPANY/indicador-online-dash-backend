import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  UnauthorizedException,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";

import { BaseMessages } from "@shared/enums";
import { AnswerRoutes, AnswerSwaggerInfo } from "./enums";
import { AnswerChoice, Answers } from "./entities/asnwers.entity";
import { AnswersService } from "./answers.service";
import {
  AnswerBaseDto,
  AnswerResponse,
  CreateAnswerChoice,
  CreateAnswerDto,
} from "./dtos/create-answer.dto";
import { QuestionId } from "./dtos/find-params.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { schema } from "./auxiliar/constants/swagger";
import { AnswerWithCheckList } from "./dtos/responses.dto";

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
    type: AnswerResponse,
  })
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  @ApiUnprocessableEntityResponse({
    description: BaseMessages.requiredFields,
    type: UnprocessableEntityException,
  })
  @ApiNotFoundResponse({
    description: BaseMessages.notFound,
    type: NotFoundException,
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
  @ApiNotFoundResponse({
    description: BaseMessages.notFound,
    type: NotFoundException,
  })
  async findByQuestionId(@Query() params: QuestionId): Promise<Answers[]> {
    return this.service.findAnswerByQuestionId({ ...params });
  }
  @Post(AnswerRoutes.createAnswerForImageQuestion)
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    type: AnswerResponse,
  })
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  @ApiUnprocessableEntityResponse({
    description: BaseMessages.requiredFields,
    type: UnprocessableEntityException,
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("image"))
  @ApiBody({
    schema: schema,
  })
  async createForImageQuestion(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: AnswerBaseDto,
  ): Promise<Answers> {
    return this.service.createAnswerForImageQuestion({
      ...dto,
      image,
    });
  }
  @Post(AnswerRoutes.createAnswerForMultipleChoiceQuestion)
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    type: AnswerChoice,
  })
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  @ApiUnprocessableEntityResponse({
    description: BaseMessages.requiredFields,
    type: UnprocessableEntityException,
  })
  @ApiNotFoundResponse({
    description: BaseMessages.notFound,
    type: NotFoundException,
  })
  async createForMultipleQuestion(
    @Body() answerDto: CreateAnswerChoice,
  ): Promise<AnswerChoice> {
    return this.service.createAnswerForMultipleChoiceQuestion({
      ...answerDto,
    });
  }
  @Get(AnswerRoutes.getWithCheckList)
  @ApiOkResponse({
    type: [AnswerWithCheckList],
  })
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  async findAnswersWithCheckList(): Promise<AnswerWithCheckList[]> {
    return this.service.findAnswerWithCheckList();
  }
}
