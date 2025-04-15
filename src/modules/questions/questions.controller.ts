import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";

import { BaseMessages } from "@shared/enums";
import {
  QuestionsMessages,
  QuestionsRoutes,
  QuestionsSwaggerInfo,
} from "./enums";
import { QuestionsWithChoices } from "./dtos/questionsWithChoices.dto";
import { QuestionsService } from "./questions.service";
import { FindParamsDto } from "./dtos/find-params.dto";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import { QuestionDto } from "./dtos/createQuestionDto";
import { Question } from "./entities/question.entity";
import { UpdateQuestion } from "./dtos/updateQuestion.dto";

@Controller(QuestionsRoutes.baseUrl)
@ApiTags(QuestionsSwaggerInfo.tags)
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}

  @Get()
  @ApiOkResponse({
    type: QuestionsWithChoices,
  })
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  findList(
    @Query() { checkListItemId, limit, page }: FindParamsDto,
  ): Promise<QuestionsWithChoices[]> {
    return this.service.findQuestionByCheckListItem({
      checkListItemId,

      limit: Number(limit),
      page: Number(page),
    });
  }
  @Get(QuestionsRoutes.findAll)
  @ApiOkResponse({
    type: QuestionsWithChoices,
  })
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  findAll(): Promise<QuestionsWithChoices[]> {
    return this.service.findAll();
  }

  @Post()
  @ApiCreatedResponse({
    type: Question,
  })
  @ApiUnprocessableEntityResponse({
    description: BaseMessages.errorOnCreate,
    type: UnprocessableEntityException,
  })
  async createQuestion(@Body() dto: QuestionDto): Promise<Question> {
    const question = await this.service.create({
      ...dto,
    });
    return question;
  }
  @Put()
  @ApiOkResponse({
    type: Question,
  })
  @ApiNotFoundResponse({
    description: BaseMessages.notFound,
    type: NotFoundException,
  })
  async updateQuestion(@Body() dto: UpdateQuestion): Promise<Question> {
    const question = await this.service.update({
      ...dto,
    });
    return question;
  }

  @Delete()
  @ApiOkResponse({
    description: QuestionsMessages.successDelete,
  })
  @ApiNotFoundResponse({
    description: BaseMessages.notFound,
    type: NotFoundException,
  })
  async deleteQuestion(
    @Query("questionId") questionId: string,
  ): Promise<{ message: QuestionsMessages.successDelete }> {
    return await this.service.delete(questionId);
  }
}
