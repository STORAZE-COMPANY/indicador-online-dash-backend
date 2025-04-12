import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("employees", (table) => {
    table.boolean("isActive").defaultTo(true).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("employees", (table) => {
    table.dropColumn("isActive");
  });
}
