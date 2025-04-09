import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("companies", (table) => {
    table.dropColumn("checkListItem_Id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("companies", (table) => {
    table.integer("checkListItem_Id").nullable();
  });
}
