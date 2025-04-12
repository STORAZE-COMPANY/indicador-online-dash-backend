import { ApiProperty } from "@nestjs/swagger";
import { EmployeesFieldsProperties } from "../enums";

export class Employee {
  @ApiProperty({ description: EmployeesFieldsProperties.id })
  id: number;
  @ApiProperty({ description: EmployeesFieldsProperties.name })
  name: string;

  @ApiProperty({ description: EmployeesFieldsProperties.email })
  email: string;

  @ApiProperty({ description: EmployeesFieldsProperties.phone })
  phone: string;

  @ApiProperty({ description: EmployeesFieldsProperties.company_id })
  company_id: number;

  @ApiProperty({ description: EmployeesFieldsProperties.password })
  password: string;

  @ApiProperty({ description: EmployeesFieldsProperties.roleId })
  role_id: string;

  @ApiProperty({ description: EmployeesFieldsProperties.roleId })
  questionId?: string;

  @ApiProperty({ description: EmployeesFieldsProperties.isActive })
  isActive?: boolean;
}

export class CreateEmployeeResponse {
  @ApiProperty({ description: EmployeesFieldsProperties.id })
  id: number;
  @ApiProperty({ description: EmployeesFieldsProperties.name })
  name: string;

  @ApiProperty({ description: EmployeesFieldsProperties.email })
  email: string;

  @ApiProperty({ description: EmployeesFieldsProperties.company_id })
  company_id: number;

  @ApiProperty({ description: EmployeesFieldsProperties.phone })
  phone: string;
}
