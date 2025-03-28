import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

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
  password: string;
}

export class ResponseAuthDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    description: "Token de acesso",
  })
  accessToken: string;
}
