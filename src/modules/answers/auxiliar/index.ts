import { EmployeesFields } from "@modules/employees/enums";
import { Knex } from "knex";
import { AnswerFieldsProperties } from "../enums";
import { CompaniesFieldsProperties } from "@modules/companies/enums";
import { Anomalies } from "@shared/enums";

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

/**
 * Constrói uma resposta de IA com base no tipo de anomalia fornecido.
 *
 * @param iaAnswer - Objeto contendo a resposta da IA, que pode ser do tipo `Anomalies`.
 * @returns Retorna o tipo de anomalia correspondente (`Anomalies.anomaly` ou `Anomalies.anomaly_restricted`)
 *          ou `undefined` caso não seja uma anomalia.
 */
export function buildIaAnswer({
  iaAnswer,
}: {
  iaAnswer: Anomalies;
}): Anomalies | undefined {
  if (iaAnswer === Anomalies.anomaly) {
    return Anomalies.anomaly;
  }
  if (iaAnswer === Anomalies.anomaly_restricted) {
    return Anomalies.anomaly_restricted;
  }

  return undefined;
}
