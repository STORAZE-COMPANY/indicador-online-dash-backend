import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("questionsChoices", (table) => {
    table.enum("anomalyStatus", ["ANOMALIA", "ANOMALIA_RESTRITIVA"]).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("questionsChoices", (table) => {
    table.dropColumn("anomalyStatus");
  });
}
