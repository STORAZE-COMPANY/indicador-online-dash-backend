import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("companies", (table) => {
    table.string("email").unique().notNullable();
    table
      .uuid("role_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("roles")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("companies", (table) => {
    table.dropColumn("email");
    table.dropColumn("role_id");
  });
}
