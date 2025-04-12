import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("answerChoice", (table) => {
    table.dropForeign(["choice_id"]);
  });

  await knex.schema.alterTable("answerChoice", (table) => {
    table
      .foreign("choice_id")
      .references("id")
      .inTable("questionsChoices")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("answerChoice", (table) => {
    table.dropForeign(["choice_id"]);
  });

  await knex.schema.alterTable("answerChoice", (table) => {
    table
      .foreign("choice_id")
      .references("id")
      .inTable("questionsChoices")
      .onDelete("NO ACTION");
  });
}
