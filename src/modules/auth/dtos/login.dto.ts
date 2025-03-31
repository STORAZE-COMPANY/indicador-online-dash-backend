import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "usuario@example.com",
    description: "Endereço de e-mail do usuário",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "senha123",
    description: "Senha do usuário (mínimo 4 caracteres)",
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty({ message: "A senha não pode estar vazio" })
  @Matches(/^(?!\s*$).+/, { message: "A senha não pode conter apenas espaços" })
  password: string;
}

class User {
  @ApiProperty({ example: "1", description: "ID do usuário" })
  @IsString()
  id: string;

  @ApiProperty({ example: "Usuário", description: "Nome do usuário" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Email do funcionário" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "user", description: "Função do usuário" })
  @IsString()
  role: string;
}

export class ResponseAuthDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    description: "Token de acesso",
  })
  access_token: string;

  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    description: "Token de atualização",
  })
  refresh_token: string;

  @ApiProperty({
    example: {
      id: "1",
      name: "Usuário",
      email: "usuario@example.com",
      role: "user",
    },
    description: "Dados do usuário autenticado",
  })
  user: User;
}
