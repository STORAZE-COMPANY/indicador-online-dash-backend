import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("questions", (table) => {
    table
      .uuid("category_id")
      .references("id")
      .inTable("categories")
      .notNullable()
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("questions", (table) => {
    table.dropColumn("category_id");
  });
}
