import { ApiProperty } from "@nestjs/swagger";

export class Employee {
  @ApiProperty({ description: "Id do funcionário" })
  id: number;
  @ApiProperty({ description: "Nome do funcionário" })
  name: string;

  @ApiProperty({ description: "Email do funcionário" })
  email: string;

  @ApiProperty({ description: "Telefone do funcionário" })
  phone: string;

  @ApiProperty({ description: "ID da empresa do funcionário" })
  company_id: number;

  @ApiProperty({ description: "Senha do funcionário" })
  password: string;
}

export class CreateEmployeeResponse {
  @ApiProperty({ description: "Id do funcionário" })
  id: number;
  @ApiProperty({ description: "Nome do funcionário" })
  name: string;

  @ApiProperty({ description: "Email do funcionário" })
  email: string;

  @ApiProperty({ description: "ID da empresa do funcionário" })
  company_id: number;

  @ApiProperty({ description: "Telefone do funcionário" })
  phone: string;
}
