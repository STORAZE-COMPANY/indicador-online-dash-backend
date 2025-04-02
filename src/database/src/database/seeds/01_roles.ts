import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Remove todos os registros antes de inserir novos
  await knex("roles").del();

  // Insere os valores padrão
  await knex("roles").insert([
    { name: "superAdmin" },
    { name: "admin" },
    { name: "user" },
  ]);
}
