import { ApiProperty } from "@nestjs/swagger";
import { EmployeesFieldsProperties } from "../enums";
import { RolesFieldsProperties } from "@modules/roles/enums";
import { CompaniesFieldsProperties } from "@modules/companies/enums";

export class EmployeeListDto {
  @ApiProperty({ description: EmployeesFieldsProperties.id })
  id: number;
  @ApiProperty({ description: EmployeesFieldsProperties.name })
  name: string;

  @ApiProperty({ description: EmployeesFieldsProperties.email })
  email: string;

  @ApiProperty({ description: EmployeesFieldsProperties.phone })
  phone: string;

  @ApiProperty({ description: CompaniesFieldsProperties.name })
  company_name: string;

  @ApiProperty({ description: RolesFieldsProperties.name })
  role_name: string;

  @ApiProperty({ description: EmployeesFieldsProperties.company_id })
  company_id: number;
}
