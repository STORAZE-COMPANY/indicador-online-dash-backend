import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BasePaginatedParams } from "@shared/enums";

export class FindParamsDto {
  @ApiProperty()
  @IsString()
  checklistId: string;

  @ApiProperty({ description: BasePaginatedParams.limit })
  @IsString()
  limit: string;

  @ApiProperty({ description: BasePaginatedParams.page })
  @IsString()
  page: string;
}
