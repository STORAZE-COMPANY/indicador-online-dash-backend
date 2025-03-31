import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, ResponseAuthDto } from "./dtos/login.dto";
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthResponseMessages } from "./enums";

/**
 * Controlador responsável pelas operações de autenticação.
 *
 * @class AuthController
 * @constructor
 * @param {AuthService} authService - Serviço responsável pela lógica de autenticação.
 */

/**
 * Endpoint para autenticação de usuários.
 *
 * @method login
 * @async
 * @param {LoginDto} loginDto - Dados de login contendo email e senha do usuário.
 * @returns {Promise<ResponseAuthDto>} Retorna os dados de autenticação do usuário.
 *
 * @throws {NotFoundException} Se o usuário não for encontrado.
 * @throws {UnauthorizedException} Se a senha estiver incorreta.
 *
 * @description
 * Este endpoint realiza a validação do usuário com base no email e senha fornecidos.
 * Caso a validação seja bem-sucedida, retorna um token de autenticação e informações
 * do usuário autenticado.
 *
 * @decorator @Post("login")
 * @decorator @ApiNotFoundResponse - Resposta para o caso de usuário não encontrado.
 * @decorator @ApiCreatedResponse - Resposta para o caso de autenticação bem-sucedida.
 * @decorator @ApiForbiddenResponse - Resposta para o caso de senha incorreta.
 */
@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiNotFoundResponse({
    description: AuthResponseMessages.userNotFound,
    type: NotFoundException,
  })
  @ApiCreatedResponse({
    type: ResponseAuthDto,
    description: "Usuário autenticado response",
  })
  @ApiForbiddenResponse({
    description: AuthResponseMessages.passwordIncorrect,
    type: UnauthorizedException,
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
  }
}
