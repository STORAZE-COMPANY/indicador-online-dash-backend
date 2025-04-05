import type { Knex } from "knex";

export async function up(): Promise<void> {}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("questionsChoices", (table) => {
    table.enum("anomaly", ["LOW", "MEDIUM", "HIGH"]).nullable();
  });
}
