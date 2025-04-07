import {
  Controller,
  Get,
  Query,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { BaseMessages } from "@shared/enums";
import { QuestionsRoutes, QuestionsSwaggerInfo } from "./enums";
import { QuestionsWithChoices } from "./dtos/questionsWithChoices.dto";
import { QuestionsService } from "./questions.service";
import { FindParamsDto } from "./dtos/find-params.dto";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";

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
}
