import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("checkList", (table) => {
    table.string("name").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("checkList", (table) => {
    table.dropColumn("name");
  });
}
