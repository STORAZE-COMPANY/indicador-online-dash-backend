import { EmployeesFields } from "@modules/employees/enums";
import { Knex } from "knex";
import { AnswerFieldsProperties } from "../enums";
import { CompaniesFieldsProperties } from "@modules/companies/enums";

export function buildAnswerListWithCheckListQueryWithJoins(
  base: Knex.QueryBuilder,
): Knex.QueryBuilder {
  return base
    .join(
      EmployeesFields.tableName,
      `${AnswerFieldsProperties.tableName}.${AnswerFieldsProperties.employee_id}`,
      `${EmployeesFields.tableName}.${EmployeesFields.id}`,
    )

    .join(
      CompaniesFieldsProperties.tableName,
      `${EmployeesFields.tableName}.${EmployeesFields.company_id}`,
      `${CompaniesFieldsProperties.tableName}.id`,
    )

    .distinct();
}
