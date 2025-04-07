import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("companies", (table) => {
    table.dropColumn("checklistIds");
    table
      .uuid("checkListItem_Id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("checkListItem")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("companies", (table) => {
    table.dropColumn("checkListItem_Id");
    table.jsonb("checklistIds").nullable();
  });
}
