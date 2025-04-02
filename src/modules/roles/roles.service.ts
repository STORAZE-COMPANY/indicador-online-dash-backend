import { Injectable } from "@nestjs/common";

import db from "database/connection";
import { Role } from "@shared/enums";
import { Roles } from "@modules/roles/entities/roles.entity";
import { Knex } from "knex";

@Injectable()
export class RolesService {
  /**
   * Retorna todas as roles com base nas permissões fornecidas.
   * @param role - Role do usuário para filtrar as permissões.
   * @returns Uma lista de roles que correspondem aos critérios.
   */
  async findAllRolesByPermission({ role }: { role: Role }): Promise<Roles[]> {
    const roles = await db<Roles>("roles").where({
      ...this.generateWhereBuilder(role),
    });

    return roles;
  }

  /**
   * Gera um construtor de condições para a consulta com base na role.
   * @param role - Role do usuário.
   * @returns Um construtor de consulta do Knex com as condições aplicadas.
   */
  generateWhereBuilder = (role: Role) => {
    return (builder: Knex.QueryBuilder<Roles>) => {
      if (role !== Role.superAdmin)
        return builder.whereNot("name", Role.superAdmin);
    };
  };
}
