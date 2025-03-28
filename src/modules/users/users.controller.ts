import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserResponseMessages } from "./enums";

/**
 * Controlador responsável por gerenciar as operações relacionadas aos usuários.
 */
@Controller("users")
@ApiTags("Users")
export class UsersController {
  /**
   * Construtor do controlador de usuários.
   *
   * @param usersService - Serviço responsável pelas operações relacionadas aos usuários.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Cria um novo usuário.
   *
   * @param user - Dados do usuário a ser criado.
   * @returns O usuário criado.
   *
   * @throws ConflictException - Caso o e-mail já esteja em uso.
   */
  @Post()
  @ApiCreatedResponse({
    type: User,
  })
  @ApiConflictResponse({
    description: UserResponseMessages.emailAlreadyExists,
    type: ConflictException,
  })
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  /**
   * Obtém um usuário pelo e-mail.
   *
   * @param email - E-mail do usuário a ser buscado.
   * @returns O usuário correspondente ao e-mail fornecido.
   *
   * @throws NotFoundException - Caso o usuário não seja encontrado.
   */
  @Get(":email")
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse({
    description: UserResponseMessages.notFound,
    type: NotFoundException,
  })
  async getByEmail(@Param("email") email: string): Promise<User> {
    return this.usersService.findOne(email);
  }

  /**
   * Obtém todos os usuários cadastrados.
   *
   * @returns Uma lista de todos os usuários.
   */
  @Get()
  @ApiOkResponse({ type: [User] })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }
}
