import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("anomalies", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("description").nullable();
    table.enum("status", ["LOW", "MEDIUM", "HIGH"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("anomalies");
}
