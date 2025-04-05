import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("questions", (table) => {
    table.enum("answerType", ["Text", "Image", "IA"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("questions", (table) => {
    table.dropColumn("answerType");
  });
}
