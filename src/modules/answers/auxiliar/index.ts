import { EmployeesFields } from "@modules/employees/enums";
import { Knex } from "knex";
import { AnswerChoiceFieldsProperties, AnswerFieldsProperties } from "../enums";
import { CompaniesFieldsProperties } from "@modules/companies/enums";
import { Anomalies } from "@shared/enums";
import {
  ChoicesFieldsProperties,
  QuestionFieldsProperties,
} from "@modules/questions/enums";

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
      QuestionFieldsProperties.tableName,
      `${AnswerFieldsProperties.tableName}.${AnswerFieldsProperties.question_id}`,
      `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.id}`,
    )

    .join(
      CompaniesFieldsProperties.tableName,
      `${EmployeesFields.tableName}.${EmployeesFields.company_id}`,
      `${CompaniesFieldsProperties.tableName}.id`,
    )

    .distinct();
}

export function buildMultipleChoiceAnswersQuery(
  base: Knex.QueryBuilder,
): Knex.QueryBuilder {
  return base
    .join(
      ChoicesFieldsProperties.tableName,
      `${AnswerChoiceFieldsProperties.tableName}.${AnswerChoiceFieldsProperties.choice_id}`,
      `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.id}`,
    )
    .join(
      EmployeesFields.tableName,
      `${AnswerChoiceFieldsProperties.tableName}.${AnswerChoiceFieldsProperties.employee_id}`,
      `${EmployeesFields.tableName}.${EmployeesFields.id}`,
    )
    .join(
      CompaniesFieldsProperties.tableName,
      `${EmployeesFields.tableName}.${EmployeesFields.company_id}`,
      `${CompaniesFieldsProperties.tableName}.id`,
    )
    .join(
      QuestionFieldsProperties.tableName,
      `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.question_id}`,
      `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.id}`,
    );
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
