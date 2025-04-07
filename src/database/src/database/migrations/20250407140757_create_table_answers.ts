import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("answers", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("textAnswer").nullable();
    table.string("imageAnswer").nullable();
    table
      .uuid("question_id")
      .notNullable()
      .references("id")
      .inTable("questions");
    table
      .integer("employee_id")
      .notNullable()
      .references("id")
      .inTable("employees");
    table.enum("anomalyStatus", ["ANOMALIA", "ANOMALIA_RESTRITIVA"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("answers");
}
