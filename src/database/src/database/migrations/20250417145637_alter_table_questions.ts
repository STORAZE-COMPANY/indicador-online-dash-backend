import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("questions", (table) => {
    table
      .uuid("checklist_id")
      .references("id")
      .inTable("checkList")
      .notNullable()
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.dropColumn("checkListItem_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("questions", (table) => {
    table.dropColumn("checklist_id");
    table
      .uuid("checkListItem_id")
      .references("id")
      .inTable("checkListItem")
      .notNullable()
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}
