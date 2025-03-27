import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("checklists", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.jsonb("categories").notNullable();
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("checklists");
}
