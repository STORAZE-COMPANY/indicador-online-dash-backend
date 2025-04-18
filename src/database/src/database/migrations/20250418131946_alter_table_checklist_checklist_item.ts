import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("checkListItem", (table) => {
    table.unique(["checkList_id", "company_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("checklistItem", (table) => {
    table.dropUnique(["checkList_id", "company_id"]);
  });
}
