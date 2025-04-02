import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import db from "database/connection";
import { AuthResponseMessages, TokenProperties } from "./enums";
import {
  SelectByWhereAuth,
  AuthResponse,
  TokenProps,
  UserAuth,
} from "./interface";
import { Knex } from "knex";
import { Employee } from "@modules/employees/entities/employee.entity";
import { Company } from "@modules/companies/entities/company.entity";
import { Role } from "@shared/enums";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /**
   * Valida as credenciais de um usuário com base no email e senha fornecidos.
   *
   * @param email - O email do usuário a ser validado.
   * @param password - A senha do usuário a ser validada.
   * @returns Uma Promise que resolve para um objeto do tipo `AuthResponse`, contendo os tokens de acesso e atualização,
   *          além das informações do usuário autenticado.
   * @throws `NotFoundException` - Caso o usuário com o email fornecido não seja encontrado.
   * @throws `ForbiddenException` - Caso a senha fornecida esteja incorreta.
   */
  async validateUser(email: string, password: string): Promise<AuthResponse> {
    const user = await this.findAuthByEmailAndRole(email);

    if (!user) throw new NotFoundException(AuthResponseMessages.userNotFound);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new ForbiddenException(AuthResponseMessages.passwordIncorrect);

    const access_token = this.generateJwtToken({
      ...user,
      expiresIn: TokenProperties.accessTokenExpiriesIn,
    });

    const refresh_token = this.generateJwtToken({
      ...user,
      expiresIn: TokenProperties.refreshTokenExpiriesIn,
    });

    return {
      access_token,
      refresh_token,
      user: this.buildUserAuth(user),
    };
  }

  /**
   * Atualiza os tokens de acesso e de atualização para um usuário autenticado.
   *
   * @param refreshToken - O token de atualização fornecido pelo cliente.
   * @returns Uma promessa que resolve para um objeto contendo o novo token de acesso,
   *          o novo token de atualização e as informações do usuário autenticado.
   * @throws NotFoundException - Lançada se o usuário associado ao token de atualização não for encontrado.
   */
  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    const { email } = this.jwtService.verify<UserAuth>(refreshToken);
    const userExist = await this.findAuthByEmailAndRole(email);
    if (!userExist)
      throw new NotFoundException(AuthResponseMessages.userNotFound);

    const access_token = this.generateJwtToken({
      ...userExist,
      expiresIn: TokenProperties.accessTokenExpiriesIn,
    });

    const refresh_token = this.generateJwtToken({
      ...userExist,
      expiresIn: TokenProperties.refreshTokenExpiriesIn,
    });

    return {
      access_token,
      refresh_token,
      user: this.buildUserAuth(userExist),
    };
  }
  /**
   * Encontra um usuário autenticado pelo email e retorna suas informações.
   *
   * @param email - email do usuário.
   * @returns Uma promessa que resolve para um objeto contendo as informações do usuário autenticado.
   * @throws  NotFoundException - Lançada se o usuário associado ao token de atualização não for encontrado.
   */
  async findAuthUser(email: string): Promise<UserAuth> {
    const user = await this.findAuthByEmailAndRole(email);
    if (!user) throw new NotFoundException(AuthResponseMessages.userNotFound);
    return user;
  }

  /**
   * Gera um token JWT para autenticação do usuário.
   *
   * @param {TokenProps} param0 - Objeto contendo as informações necessárias para gerar o token.
   * @param {string} param0.email - O e-mail do usuário.
   * @param {string} param0.expiresIn - O tempo de expiração do token.
   * @param {string} param0.id - O identificador único do usuário.
   * @param {string} param0.name - O nome do usuário.
   * @param {string} param0.role - O papel ou função do usuário no sistema.
   * @returns {string} O token JWT gerado.
   */
  generateJwtToken({ email, expiresIn, id, name, role }: TokenProps) {
    const user: UserAuth = {
      id,
      email,
      role,
      name,
    };
    return this.jwtService.sign(user, {
      expiresIn,
    });
  }

  /**
   * Constrói um objeto de autenticação do usuário a partir de um objeto de entrada que inclui a senha.
   *
   * @param user - Objeto do tipo `UserAuth` que também contém a propriedade `password`.
   * @returns Um novo objeto `UserAuth` contendo apenas as propriedades necessárias para autenticação.
   */
  buildUserAuth(user: UserAuth & { password: string }): UserAuth {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
  /**
   * Gera uma função de construção de consulta (query builder) para filtrar registros
   * com base no email fornecido e excluindo aqueles com o papel de usuário comum (Role.user).
   *
   * @param email - O email utilizado como critério de filtro na consulta.
   * @returns Uma função que recebe um `Knex.QueryBuilder` e aplica os filtros especificados.
   */
  generateWhereBuilder({
    email,
    entityName,
  }: {
    email: string;
    entityName: "companies" | "employees";
  }) {
    return (builder: Knex.QueryBuilder<SelectByWhereAuth>) => {
      builder
        .join("roles", `${entityName}.role_id`, "roles.id")
        .where("email", email)
        .andWhereNot("roles.name", Role.user);
    };
  }

  /**
   * Busca um usuário autenticado pelo email e retorna suas informações, incluindo a senha.
   *
   * @param email - O email do usuário a ser buscado.
   * @returns Uma Promise que resolve para um objeto contendo as informações do usuário
   *          autenticado, incluindo a senha.
   * @throws NotFoundException - Lançada caso nenhum usuário seja encontrado com o email fornecido.
   */
  async findAuthByEmailAndRole(
    email: string,
  ): Promise<UserAuth & { password: string }> {
    let userAuth: (UserAuth & { password: string }) | null = null;
    const select = {
      id: "id",
      name: "name",
      email: "email",
      role: "role",
      password: "password",
    };

    userAuth = await db<Employee>("employees")
      .where(this.generateWhereBuilder({ email, entityName: "employees" }))
      .first()
      .select(Object.values(select), "roles.name as role");

    userAuth = await db<Company>("employees")
      .join("roles", "companies.role_id", "roles.id")
      .where(this.generateWhereBuilder({ email, entityName: "companies" }))
      .first()
      .select(Object.values(select), "roles.name as role");

    if (!userAuth)
      throw new NotFoundException(AuthResponseMessages.userNotFound);

    return userAuth;
  }
}
