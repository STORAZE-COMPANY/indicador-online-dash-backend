import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("companies", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("cnpj").notNullable().unique();
    table.boolean("isActive").defaultTo(true);
    table.jsonb("checklistIds").defaultTo("[]");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("companies");
}
