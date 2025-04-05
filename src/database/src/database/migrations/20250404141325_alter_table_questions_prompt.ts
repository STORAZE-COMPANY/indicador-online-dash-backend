import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("questions", (table) => {
    table.string("IAPrompt").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("questions", (table) => {
    table.dropColumn("IAPrompt");
  });
}
