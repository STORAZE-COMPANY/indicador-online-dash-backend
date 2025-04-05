import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("checklists");
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable("checklists", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description").nullable();
    table.integer("user_id").unsigned().references("id").inTable("users");
    table.timestamps(true, true);
  });
}
