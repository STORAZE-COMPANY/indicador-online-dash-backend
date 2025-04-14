import { Knex } from "knex";

export function buildFindCompanySettingsQuery(
  base: Knex.QueryBuilder,
): Knex.QueryBuilder {
  return base.join("companies", "companySettings.company_id", "companies.id");
}
