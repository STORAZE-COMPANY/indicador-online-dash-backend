import { ApiProperty } from "@nestjs/swagger";

export class Employee {
  @ApiProperty({ description: "Id do funcionário" })
  id: number;
  @ApiProperty({ description: "Nome do funcionário" })
  name: string;

  @ApiProperty({ description: "Email do funcionário" })
  email: string;

  @ApiProperty({ description: "Senha do funcionário (mínimo de 4 caracteres)" })
  password: string;

  @ApiProperty({ description: "ID da empresa do funcionário" })
  companyId: number;
}
