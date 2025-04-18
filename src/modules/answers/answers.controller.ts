import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
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
  ApiQuery,
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
  CreateAnomalyResolutionDTO,
  CreateAnswerChoice,
  CreateAnswerDto,
} from "./dtos/create-answer.dto";
import { QuestionId } from "./dtos/find-params.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { schema, schemaAnomalyResolution } from "./auxiliar/constants/swagger";
import { AnswersWithQuestions } from "./dtos/responses.dto";
import { AnomalyResolution } from "./entities/answersResolution.entity";
import { UpdateAnomalyResolutionDTO } from "./dtos/update-answer.dto";
import { AnswersWithQuestion } from "./dtos/find-answers.dto";

@Controller(AnswerRoutes.baseUrl)
@ApiTags(AnswerSwaggerInfo.tags)
export class AnswersController {
  constructor(private readonly service: AnswersService) {}

  @Get()
  @ApiOkResponse({
    type: [AnswersWithQuestion],
  })
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  @ApiQuery({
    name: "employee_id",
    required: false,
    description: "ID do funcionário",
    type: String,
  })
  findList(
    @Query("employee_id") employee_id?: string,
  ): Promise<AnswersWithQuestion[]> {
    return this.service.findAllAnswers(employee_id);
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
    type: [AnswersWithQuestions],
  })
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  async findAnswersWithCheckList(
    @Query("checkList_id") checkList_id: string,
  ): Promise<AnswersWithQuestions[]> {
    return this.service.findAnswerWithCheckList({ checkList_id });
  }

  @Post(AnswerRoutes.createAnomalyResolution)
  @ApiCreatedResponse({
    type: AnomalyResolution,
  })
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  @ApiNotFoundResponse({
    description: BaseMessages.notFound,
    type: NotFoundException,
  })
  @UseGuards(JwtAuthGuard)
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("image"))
  @ApiBody({
    schema: schemaAnomalyResolution,
  })
  async createAnomalyResolution(
    @Body() dto: CreateAnomalyResolutionDTO,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<AnomalyResolution> {
    return this.service.createResolutionForAnomaly({ ...dto, image });
  }

  @Put(AnswerRoutes.updateAnomalyResolution)
  @ApiOkResponse({
    type: AnomalyResolution,
  })
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  @ApiNotFoundResponse({
    description: BaseMessages.notFound,
    type: NotFoundException,
  })
  async updateAnomalyResolution(@Body() dto: UpdateAnomalyResolutionDTO) {
    return this.service.updateResolutionForAnomaly({ ...dto });
  }

  @Get(AnswerRoutes.getAnomalyResolutionByAnswerId)
  @ApiOkResponse({
    type: AnomalyResolution,
  })
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  @ApiNotFoundResponse({
    description: BaseMessages.notFound,
    type: NotFoundException,
  })
  @UseGuards(JwtAuthGuard)
  async findAnomalyResolutionById(@Query("answer_id") answer_id: string) {
    return this.service.findAnomalyResolutionByAnswerId(answer_id);
  }
  @Get(AnswerRoutes.getAnomalyResolution)
  @ApiOkResponse({
    type: [AnomalyResolution],
  })
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: "answer_id",
    required: false,
    description: "ID da resposta",
    type: String,
  })
  async findAnomalyResolutionList(@Query("answer_id") answer_id?: string) {
    return this.service.findAnomalyResolutionList(answer_id);
  }
}
