import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("anomalyResolution", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.text("description").nullable();
    table.string("imageUrl").nullable();
    table
      .enum("status", ["PENDING", "RESOLVED", "REJECTED"])
      .defaultTo("PENDING");
    table
      .uuid("answer_id")
      .notNullable()
      .references("id")
      .inTable("answers")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .integer("updated_by")
      .nullable()
      .references("id")
      .inTable("employees")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("anomalyResolution");
}
