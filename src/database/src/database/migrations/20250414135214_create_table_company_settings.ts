import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("companySettings", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.integer("answersExpirationTime").nullable();
    table
      .integer("company_id")
      .notNullable()
      .references("id")
      .inTable("companies")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")
      .unique();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("companySettings");
}
