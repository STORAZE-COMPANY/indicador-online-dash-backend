import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("iaPromptAnswers", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("answer_id")
      .notNullable()
      .references("id")
      .inTable("answers")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("textAnswer").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("iaPromptAnswers");
}
