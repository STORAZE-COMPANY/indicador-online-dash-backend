import { Knex } from "knex";
import {
  EntityToAuth,
  SelectByWhereAuth,
  TokenProps,
  UserAuth,
} from "../interface";
import { Role } from "@shared/enums";
import { JwtService } from "@nestjs/jwt";

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
export function generateJwtToken({
  email,
  expiresIn,
  id,
  name,
  role,
  jwtService,
}: TokenProps & { jwtService: JwtService }) {
  const user: UserAuth = {
    id,
    email,
    role,
    name,
  };
  return jwtService.sign(user, {
    expiresIn,
  });
}

/**
 * Constrói um objeto de autenticação do usuário a partir de um objeto de entrada que inclui a senha.
 *
 * @param user - Objeto do tipo `UserAuth` que também contém a propriedade `password`.
 * @returns Um novo objeto `UserAuth` contendo apenas as propriedades necessárias para autenticação.
 */
export function buildUserAuth(user: UserAuth & { password: string }): UserAuth {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

/**
 * Gera uma função de construção de consulta para o Knex com base nos parâmetros fornecidos.
 *
 * @param params - Objeto contendo os parâmetros para a construção da consulta.
 * @param params.email - O email a ser utilizado como critério de busca.
 * @param params.isLoginOnMobile - Indica se o login está sendo realizado em um dispositivo móvel (opcional).
 * @param params.entityName - O nome da entidade que será utilizada na consulta.
 *
 * @returns Uma função que recebe um `Knex.QueryBuilder` e aplica os critérios de consulta especificados.
 */
export function generateWhereBuilder({
  email,
  entityName,
  isLoginOnMobile,
}: {
  email: string;
  isLoginOnMobile?: boolean;
  entityName: EntityToAuth;
}) {
  return (builder: Knex.QueryBuilder<SelectByWhereAuth>) => {
    builder
      .where(`${entityName}.email`, email)
      .andWhere(`companies.isActive`, true);
    if (!isLoginOnMobile) {
      builder.andWhereNot("roles.name", Role.user);
    }
  };
}

/**
 * Gera uma lista de campos selecionados para uma entidade específica.
 *
 * @param entityName - O nome da entidade para a qual os campos serão gerados.
 * @returns Um array contendo os campos selecionados no formato `${entityName}.campo`.
 */
export function generateSelect(entityName: EntityToAuth) {
  const fields = {
    id: `${entityName}.id`,
    name: `${entityName}.name`,
    email: `${entityName}.email`,
    role_id: `${entityName}.role_id`,
    password: `${entityName}.password`,
    role_name: "roles.name as role",
  };
  return Object.values(fields);
}
