import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("checkListItem", (table) => {
    table
      .integer("company_id")
      .nullable()
      .references("id")
      .inTable("companies");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("checkListItem", (table) => {
    table.dropColumn("company_id");
  });
}
