import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("questions", (table) => {
    table.dropColumn("checkList_id");
    table
      .uuid("checkListItem_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("checkListItem")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("questions", (table) => {
    table.dropColumn("checkListItem_id");
    table
      .uuid("checkList_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("checkList")
      .onDelete("CASCADE");
  });
}
