import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("companies", (table) => {
    table.dropForeign("role_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("companies", (table) => {
    table
      .integer("role_id")
      .unsigned()
      .references("id")
      .inTable("roles")
      .onDelete("SET NULL");
  });
}
