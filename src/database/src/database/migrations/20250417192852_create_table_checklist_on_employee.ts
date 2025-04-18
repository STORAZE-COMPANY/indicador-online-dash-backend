import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("checklistOnEmployee", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.integer("employee_id").notNullable();
    table.uuid("checklist_id").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Foreign key constraints
    table.foreign("employee_id").references("id").inTable("employees");
    table.foreign("checklist_id").references("id").inTable("checkList");
    table.unique(["employee_id", "checklist_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("checklistOnEmployee");
}
