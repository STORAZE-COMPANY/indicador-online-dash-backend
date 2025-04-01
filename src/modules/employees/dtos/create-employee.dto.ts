import {
  IsEmail,
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  notBlankRegex,
  phoneRegex,
} from "@shared/validations/annotationsValidations";
import { BaseMessagesValidations } from "@shared/enums";
import { EmployeesFieldsProperties } from "../enums";

export class CreateEmployeeDto {
  @ApiProperty({ description: EmployeesFieldsProperties.name })
  @IsString()
  @IsNotEmpty({ message: BaseMessagesValidations.notEmpty })
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  name: string;

  @ApiProperty({ description: EmployeesFieldsProperties.email })
  @IsEmail()
  email: string;

  @ApiProperty({ description: EmployeesFieldsProperties.phone })
  @IsString()
  @Matches(phoneRegex, {
    message: BaseMessagesValidations.phoneRegex,
  })
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  phone: string;

  @ApiProperty({ description: EmployeesFieldsProperties.company_id })
  @IsNumber({}, { message: BaseMessagesValidations.isNumber })
  @Min(1, { message: BaseMessagesValidations.notNegative })
  company_id: number;
}
