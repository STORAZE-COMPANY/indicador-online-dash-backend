import {
  Controller,
  ForbiddenException,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import { Roles } from "./entities/roles.entity";
import { CustomRequest } from "@modules/auth/auth.strategy";
import { RolesService } from "./roles.service";
import { BaseMessages, Role } from "@shared/enums";
import { RolesRoutes, RolesSwaggerInfo } from "./enums";

@Controller(RolesRoutes.baseUrl)
@ApiTags(RolesSwaggerInfo.tags)
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Get()
  @ApiOkResponse({
    type: [Roles],
  })
 /*  @UseGuards(JwtAuthGuard) */
  @ApiUnauthorizedResponse({
    description: BaseMessages.unAuthorizedUser,
    type: UnauthorizedException,
  })
  findList() {
   /*  if (!request.user)
      throw new ForbiddenException(BaseMessages.unAuthorizedUser); */
    return this.service.findAllRolesByPermission({ role:Role.superAdmin});
  }
}
