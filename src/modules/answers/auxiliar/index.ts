import { EmployeesFields } from "@modules/employees/enums";
import { Knex } from "knex";
import {
  AnswerChoiceFieldsProperties,
  AnswerFieldsProperties,
  IaPromptAnswerFieldsProperties,
} from "../enums";
import { CompaniesFieldsProperties } from "@modules/companies/enums";
import { Anomalies, BaseMessages, Role } from "@shared/enums";
import {
  ChoicesFieldsProperties,
  QuestionFieldsProperties,
} from "@modules/questions/enums";
import { RolesFieldsProperties } from "@modules/roles/enums";
import { Answers } from "../entities/asnwers.entity";
import { UnprocessableEntityException } from "@nestjs/common";

export function buildAnswerListWithCheckListQueryWithJoins({
  base,
  checkListItemId,
}: {
  base: Knex.QueryBuilder;
  checkListItemId?: string;
}): Knex.QueryBuilder {
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

    .where((builder) => {
      if (checkListItemId) {
        builder.where(
          `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.checkList_id}`,
          checkListItemId,
        );
      }
    })
    .distinct();
}

export function buildMultipleChoiceAnswersQuery({
  base,
  checkListItemId,
}: {
  base: Knex.QueryBuilder;
  checkListItemId?: string;
}): Knex.QueryBuilder {
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
    )
    .where((builder) => {
      if (checkListItemId) {
        builder.where(
          `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.checkList_id}`,
          checkListItemId,
        );
      }
    });
}

export function formatIaAnswer(iaAnswer: string) {
  const match = iaAnswer.match(/(ANOMALIA_RESTRITIVA|ANOMALIA):/);

  const anomalyResponse = match
    ? (match[1] as Anomalies)
    : BaseMessages.noAnomaly;
  if (anomalyResponse) {
    if (
      anomalyResponse !== Anomalies.anomaly &&
      anomalyResponse !== Anomalies.anomaly_restricted &&
      anomalyResponse !== BaseMessages.noAnomaly
    )
      throw new UnprocessableEntityException(
        BaseMessages.iaResponseNotExpected,
        iaAnswer,
      );
  }
  return anomalyResponse;
}

export function buildAnswerOnAnomalyResolutionQuery({
  base,
  answer_id,
}: {
  answer_id: string;
  base: Knex.QueryBuilder<Answers>;
}): Knex.QueryBuilder {
  return base
    .join(
      QuestionFieldsProperties.tableName,
      `${AnswerFieldsProperties.tableName}.${AnswerFieldsProperties.question_id}`,
      `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.id}`,
    )
    .join(
      IaPromptAnswerFieldsProperties.tableName,
      `${AnswerFieldsProperties.tableName}.${AnswerFieldsProperties.id}`,
      `${IaPromptAnswerFieldsProperties.tableName}.${IaPromptAnswerFieldsProperties.answer_id}`,
    )

    .where(
      `${AnswerFieldsProperties.tableName}.${AnswerFieldsProperties.id}`,
      answer_id,
    );
}

export function buildEmployeesAnomalyResolutionQuery({
  base,
  companyId,
}: {
  base: Knex.QueryBuilder;
  companyId: number;
}): Knex.QueryBuilder {
  return base
    .join(
      CompaniesFieldsProperties.tableName,
      `${EmployeesFields.tableName}.${EmployeesFields.company_id}`,
      `${CompaniesFieldsProperties.tableName}.id`,
    )
    .join(
      RolesFieldsProperties.tableName,
      `${EmployeesFields.tableName}.${EmployeesFields.roleId}`,
      `${RolesFieldsProperties.tableName}.id`,
    )
    .where(`${CompaniesFieldsProperties.tableName}.id`, companyId)
    .andWhere(`${RolesFieldsProperties.tableName}.name`, Role.superAdmin)
    .orWhere(`${RolesFieldsProperties.tableName}.name`, Role.admin);
}

export function buildMultipleQuestionAnswerQuery({
  base,
  choice_id,
}: {
  base: Knex.QueryBuilder;
  choice_id: string;
}) {
  return base
    .join(
      QuestionFieldsProperties.tableName,
      `${ChoicesFieldsProperties.tableName}.question_id`,
      `${QuestionFieldsProperties.tableName}.id`,
    )
    .where(`${ChoicesFieldsProperties.tableName}.id`, choice_id)
    .first();
}
