import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from "class-validator";
import { EmployeesFieldsProperties } from "../enums";
import { phoneRegex } from "@shared/validations/annotationsValidations";
import { BaseMessagesValidations } from "@shared/enums";

export class UpdateEmployeeDto {
  @ApiProperty({ description: EmployeesFieldsProperties.id })
  @IsNumber({}, { message: BaseMessagesValidations.isNumber })
  @Min(1, { message: BaseMessagesValidations.notNegative })
  id: number;

  @ApiPropertyOptional({ description: EmployeesFieldsProperties.name })
  @IsNonBlankString({ isOptional: true })
  name?: string;

  @ApiPropertyOptional({ description: EmployeesFieldsProperties.email })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: EmployeesFieldsProperties.phone })
  @IsString()
  @Matches(phoneRegex, {
    message: BaseMessagesValidations.phoneRegex,
  })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: EmployeesFieldsProperties.company_id })
  @IsNumber({}, { message: BaseMessagesValidations.isNumber })
  @Min(1, { message: BaseMessagesValidations.notNegative })
  @IsOptional()
  company_id?: number;

  @ApiPropertyOptional({ description: EmployeesFieldsProperties.roleId })
  @IsString()
  @IsNonBlankString({ isOptional: true })
  role_id?: string;

  @ApiPropertyOptional({ description: EmployeesFieldsProperties.isActive })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
