import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("questionsChoices", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("choice").notNullable();
    table
      .uuid("question_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("questions")
      .onDelete("CASCADE");
    table.boolean("isAnomaly").defaultTo(false);
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("questionsChoices");
}
