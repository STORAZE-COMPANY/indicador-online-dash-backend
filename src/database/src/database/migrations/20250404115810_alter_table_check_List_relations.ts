import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("checkList", (table) => {
    table.dropColumn("categories_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("checkList", (table) => {
    table
      .uuid("categories_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");
  });
}
