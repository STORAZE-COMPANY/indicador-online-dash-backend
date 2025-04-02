import { ApiProperty } from "@nestjs/swagger";
import { RolesFieldsProperties } from "../enums";
import { Role as RoleEnum } from "@shared/enums";

export class Roles {
  @ApiProperty({ description: RolesFieldsProperties.id })
  id: string;

  @ApiProperty({ description: RolesFieldsProperties.name })
  name: RoleEnum;

  @ApiProperty({ description: RolesFieldsProperties.created_at })
  created_at: Date;

  @ApiProperty({ description: RolesFieldsProperties.updated_at })
  updated_at: Date;
}
