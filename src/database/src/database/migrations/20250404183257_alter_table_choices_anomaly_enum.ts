import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  /*  await knex.schema.alterTable("questionsChoices", (table) => {
    table.dropColumn("anomaly");
  }); */
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("questionsChoices", (table) => {
    table.enum("anomaly", ["LOW", "MEDIUM", "HIGH"]).nullable();
  });
}
