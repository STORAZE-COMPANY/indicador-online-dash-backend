import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class User {
  @ApiProperty({ example: "John Doe", description: "Nome do usuário" })
  id: string;

  @ApiProperty({
    example: "johndoe@example.com",
    description: "Email do usuário",
  })
  email: string;

  @ApiProperty({ example: "senha123", description: "Senha do usuário" })
  password: string;

  @ApiProperty({
    example: "John Doe",
    description: "Nome do usuário (opcional)",
  })
  name: string;

  @ApiProperty({ example: "admin", description: "Papel do usuário (opcional)" })
  @Optional()
  role?: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Data de criação do usuário (opcional)",
  })
  @Optional()
  created_at?: Date;

  @ApiProperty({
    example: "2023-01-02T00:00:00.000Z",
    description: "Data de atualização do usuário (opcional)",
  })
  @Optional()
  updated_at?: Date;
}
