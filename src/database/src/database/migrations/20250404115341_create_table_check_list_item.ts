import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("checkListItem", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("categories_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");
    table
      .uuid("checkList_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("checkList")
      .onDelete("CASCADE");

    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("checkListItem");
}
