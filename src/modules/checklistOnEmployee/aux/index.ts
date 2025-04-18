import { CheckListFieldsProperties } from "@modules/checklists/enums/checkList.enum";
import { Knex } from "knex";
import { ChecklistOnEmployeeFieldsProperties } from "../enums";

import {
  checklistsWithQuestions,
  checklistsWithQuestionsGrouped,
} from "../interfaces";

export function buildCheckListWithEmployeeRelatedQueryWithJoins({
  Knex,
  employeeId,
  query,
}: {
  Knex: Knex.QueryBuilder;
  employeeId: string;
  query?: string;
}) {
  return Knex.join(
    CheckListFieldsProperties.tableName,
    ` ${CheckListFieldsProperties.tableName}.id`,
    `${ChecklistOnEmployeeFieldsProperties.tableName}.checklist_id`,
  )

    .where(
      `${ChecklistOnEmployeeFieldsProperties.tableName}.${ChecklistOnEmployeeFieldsProperties.employeeId}`,
      employeeId,
    )
    .andWhere((builder) => {
      if (query) {
        builder.where("checklist.name", "ILIKE", `%${query}%`);
      }
    });
}

export function buildChecklistGroupedWithQuestions(
  checklistsWithQuestions: checklistsWithQuestions[],
) {
  const grouped: Record<string, checklistsWithQuestionsGrouped> = {};
  for (const row of checklistsWithQuestions) {
    if (!grouped[row.checkListId]) {
      grouped[row.checkListId] = {
        checkListId: row.checkListId,
        checkListName: row.checkListName,
        questions: [],
      };
    }

    grouped[row.checkListId].questions.push({
      questionId: row.questionId,
      question: row.question,
      answered: row.answered,
      ...(row.answered && {
        answers: {
          answerId: row.answerChoiceId || row.answerId,
          answer: row.textAnswer || row.imageAnswer || row.choice || "",
          AnomalyStatus: row.anomalyStatus || row.anomalyChoiceStatus,
        },
      }),
    });
  }
  return Object.values(grouped);
}
