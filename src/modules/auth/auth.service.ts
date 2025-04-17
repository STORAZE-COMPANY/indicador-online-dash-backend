import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import db from "database/connection";
import { AuthResponseMessages, TokenProperties } from "./enums";
import { AuthResponse, UserAuth } from "./interface";
import { Employee } from "@modules/employees/entities/employee.entity";
import {
  buildUserAuth,
  generateJwtToken,
  generateSelect,
  generateWhereBuilder,
} from "./auxiliar/auxiliar.func";

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
  async loginOnDashboard(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const user = await this.findAuthByEmailAndRole(email);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new ForbiddenException(AuthResponseMessages.passwordIncorrect);

    const access_token = generateJwtToken({
      ...user,
      expiresIn: TokenProperties.accessTokenExpiriesIn,
      jwtService: this.jwtService,
    });

    const refresh_token = generateJwtToken({
      ...user,
      expiresIn: TokenProperties.refreshTokenExpiriesIn,
      jwtService: this.jwtService,
    });

    return {
      access_token,
      refresh_token,
      user: buildUserAuth(user),
    };
  }
  async loginOnMobile(email: string, password: string): Promise<AuthResponse> {
    const user = await this.findAuthEmployeeByEmailAndRole(email, true);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new ForbiddenException(AuthResponseMessages.passwordIncorrect);

    const access_token = generateJwtToken({
      ...user,
      expiresIn: TokenProperties.accessTokenExpiriesIn,
      jwtService: this.jwtService,
    });

    const refresh_token = generateJwtToken({
      ...user,
      expiresIn: TokenProperties.refreshTokenExpiriesIn,
      jwtService: this.jwtService,
    });

    return {
      access_token,
      refresh_token,
      user: buildUserAuth(user),
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

    const access_token = generateJwtToken({
      ...userExist,
      expiresIn: TokenProperties.accessTokenExpiriesIn,
      jwtService: this.jwtService,
    });

    const refresh_token = generateJwtToken({
      ...userExist,
      expiresIn: TokenProperties.refreshTokenExpiriesIn,
      jwtService: this.jwtService,
    });

    return {
      access_token,
      refresh_token,
      user: buildUserAuth(userExist),
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
   * Busca um usuário autenticado pelo email e retorna suas informações, incluindo a senha.
   *
   * @param email - O email do usuário a ser buscado.
   * @returns Uma Promise que resolve para um objeto contendo as informações do usuário
   *          autenticado, incluindo a senha.
   * @throws NotFoundException - Lançada caso nenhum usuário seja encontrado com o email fornecido.
   */
  async findAuthByEmailAndRole(
    email: string,
    isLoginOnMobile?: boolean,
  ): Promise<UserAuth & { password: string }> {
    const userAuth: UserAuth & { password: string } = await db<Employee>(
      "employees",
    )
      .join("roles", "employees.role_id", "roles.id")
      .join("companies", "employees.company_id", "companies.id")
      .where(
        generateWhereBuilder({
          email,
          entityName: "employees",
          isLoginOnMobile,
        }),
      )
      .first()
      .select(generateSelect("employees"));

    if (!userAuth)
      throw new NotFoundException(AuthResponseMessages.userNotFound);

    return userAuth;
  }
  async findAuthEmployeeByEmailAndRole(
    email: string,
    isLoginOnMobile?: boolean,
  ): Promise<UserAuth & { password: string }> {
    let userAuth: (UserAuth & { password: string }) | null = null;

    userAuth = await db<Employee>("employees")
      .join("roles", "employees.role_id", "roles.id")
      .join("companies", "employees.company_id", "companies.id")
      .where(
        generateWhereBuilder({
          email,
          entityName: "employees",
          isLoginOnMobile,
        }),
      )
      .first()
      .select(generateSelect("employees"));

    if (!userAuth)
      throw new NotFoundException(AuthResponseMessages.userNotFound);

    return userAuth;
  }
}
