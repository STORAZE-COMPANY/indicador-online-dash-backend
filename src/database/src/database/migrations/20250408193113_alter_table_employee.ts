import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("employees", (table) => {
    table.dropColumn("questionId");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("employee", (table) => {
    table.integer("questionId").notNullable();
  });
}
