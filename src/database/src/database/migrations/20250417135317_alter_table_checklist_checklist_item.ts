import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("checkListItem", (table) => {
    table
      .uuid("categories_id")
      .unsigned()
      .references("id")
      .inTable("categories");
  });
}
