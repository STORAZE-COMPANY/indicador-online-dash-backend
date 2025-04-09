import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("answerChoice", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("choice_id")
      .notNullable()
      .references("id")
      .inTable("questionsChoices");
    table
      .integer("employee_id")
      .notNullable()
      .references("id")
      .inTable("employees");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("answerChoice");
}
