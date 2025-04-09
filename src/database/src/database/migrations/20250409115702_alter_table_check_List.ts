import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("checkList", (table) => {
    table.timestamp("expiries_in").nullable().alter();
    table.timestamp("images_expiries_in").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("checkList", (table) => {
    table.timestamp("expiries_in").notNullable().alter();
    table.timestamp("images_expiries_in").notNullable().alter();
  });
}
