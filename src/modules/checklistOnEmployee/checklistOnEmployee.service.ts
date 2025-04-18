import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";

import db from "database/connection";

import { ChecklistOnEmployeeFieldsProperties } from "./enums";
import { checklistOnEmployeeCreateDto } from "./dtos/create.dto";
import { checklistOnEmployee } from "./entities/checklistOnEmployee.entity";
import { CheckListForSpecificEmployee } from "./dtos/responses.dto";
import {
  buildChecklistGroupedWithQuestions,
  buildCheckListWithEmployeeRelatedQueryWithJoins,
} from "./aux";
import { FindByEmployee } from "./dtos/find-params.dto";
import { CheckListFieldsProperties } from "@modules/checklists/enums/checkList.enum";
import { checklistOnEmployeeUpdateDto } from "./dtos/update.dto";
import { BaseMessages } from "@shared/enums";
import {
  checklistsWithQuestions,
  checklistsWithQuestionsGrouped,
} from "./interfaces";
import {
  ChoicesFieldsProperties,
  QuestionFieldsProperties,
} from "@modules/questions/enums";
import {
  AnswerChoiceFieldsProperties,
  AnswerFieldsProperties,
} from "@modules/answers/enums";

import { CheckList } from "@modules/checklists/entities/checklist.entity";
import { selectQueryForCheckListWithQuestions } from "./aux/constants";

@Injectable()
export class ChecklistOnEmployeeService {
  async connectCheckListOnEmployee({
    checklist_id,
    employee_id,
  }: checklistOnEmployeeCreateDto): Promise<checklistOnEmployee> {
    const checkListOnEmployee = await db<checklistOnEmployee>(
      ChecklistOnEmployeeFieldsProperties.tableName,
    )
      .where({ checklist_id, employee_id })
      .first();

    if (checkListOnEmployee) {
      throw new UnprocessableEntityException(BaseMessages.alreadyExists);
    }

    const [created] = await db<checklistOnEmployee>(
      ChecklistOnEmployeeFieldsProperties.tableName,
    )
      .insert({
        checklist_id,
        employee_id,
      })
      .returning("*");

    return created;
  }
  async connectCheckListOnEmployeeBatch(
    params: checklistOnEmployeeCreateDto[],
  ): Promise<checklistOnEmployee> {
    const checkListOnEmployee = await db<checklistOnEmployee>(
      ChecklistOnEmployeeFieldsProperties.tableName,
    ).where((builder) => {
      for (const { checklist_id, employee_id } of params) {
        builder.where({ checklist_id, employee_id });
      }
    });

    if (checkListOnEmployee && checkListOnEmployee.length > 0) {
      throw new UnprocessableEntityException(BaseMessages.alreadyExists);
    }

    const [created] = await db<checklistOnEmployee>(
      ChecklistOnEmployeeFieldsProperties.tableName,
    )
      .insert(params)
      .returning("*");

    return created;
  }
  async findPaginatedByEmployeeResponsible({
    employeeId,
    query,
  }: FindByEmployee): Promise<CheckListForSpecificEmployee[]> {
    const checkListItemList: CheckListForSpecificEmployee[] =
      await buildCheckListWithEmployeeRelatedQueryWithJoins({
        Knex: db<checklistOnEmployee>(
          ChecklistOnEmployeeFieldsProperties.tableName,
        ),
        employeeId,
        query,
      }).select([
        `${ChecklistOnEmployeeFieldsProperties.tableName}.${ChecklistOnEmployeeFieldsProperties.id}`,

        `${CheckListFieldsProperties.tableName}.id as checklistId`,
        `${CheckListFieldsProperties.tableName}.name as checklistName`,
      ]);

    return checkListItemList;
  }

  async updateChecklistOnEmployee({
    checklist_id,
    employee_id,
  }: checklistOnEmployeeUpdateDto): Promise<checklistOnEmployee> {
    const checkListOnEmployee = await db<checklistOnEmployee>(
      ChecklistOnEmployeeFieldsProperties.tableName,
    )
      .where({ employee_id })
      .first();
    if (!checkListOnEmployee)
      throw new NotFoundException(BaseMessages.notFound);
    const [updated] = await db<checklistOnEmployee>(
      ChecklistOnEmployeeFieldsProperties.tableName,
    )
      .update({
        checklist_id,
        employee_id,
      })
      .where({ employee_id })
      .returning("*");

    return updated;
  }

  async deleteChecklistOnEmployee({
    checklist_id,
    employee_id,
  }: checklistOnEmployeeCreateDto): Promise<checklistOnEmployee> {
    const checkListOnEmployee = await db<checklistOnEmployee>(
      ChecklistOnEmployeeFieldsProperties.tableName,
    )
      .where({ checklist_id, employee_id })
      .first();
    if (!checkListOnEmployee)
      throw new NotFoundException(BaseMessages.notFound);
    const [deleted] = await db<checklistOnEmployee>(
      ChecklistOnEmployeeFieldsProperties.tableName,
    )
      .where({ checklist_id, employee_id })
      .delete()
      .returning("*");

    return deleted;
  }

  async answerChecklistOnEmployee({
    employeeId,
  }: {
    employeeId: number;
  }): Promise<checklistsWithQuestionsGrouped[]> {
    const checklistsWithQuestions: checklistsWithQuestions[] =
      await db<CheckList>(CheckListFieldsProperties.tableName)
        .select(db.raw(selectQueryForCheckListWithQuestions))
        .innerJoin(
          ChecklistOnEmployeeFieldsProperties.tableName,
          `${ChecklistOnEmployeeFieldsProperties.tableName}.${ChecklistOnEmployeeFieldsProperties.checklistId}`,
          `${CheckListFieldsProperties.tableName}.id`,
        )
        .where(
          `${ChecklistOnEmployeeFieldsProperties.tableName}.${ChecklistOnEmployeeFieldsProperties.employeeId}`,
          employeeId,
        )
        .leftJoin(
          QuestionFieldsProperties.tableName,
          ` ${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.checkList_id}`,
          `${CheckListFieldsProperties.tableName}.id`,
        )

        .leftJoin(
          ChoicesFieldsProperties.tableName,
          `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.question_id}`,
          `${QuestionFieldsProperties.tableName}.id`,
        )
        .leftJoin(`${AnswerChoiceFieldsProperties.tableName}`, function () {
          this.on(
            `${AnswerChoiceFieldsProperties.tableName}.${AnswerChoiceFieldsProperties.choice_id}`,
            "=",
            `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.id}`,
          ).andOn(
            `${AnswerChoiceFieldsProperties.tableName}.${AnswerChoiceFieldsProperties.employee_id}`,
            "=",
            db.raw("?", [employeeId]),
          );
        })
        .leftJoin(`${AnswerFieldsProperties.tableName}`, function () {
          this.on(
            `${AnswerFieldsProperties.tableName}.${AnswerFieldsProperties.question_id}`,
            "=",
            `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.id}`,
          ).andOn(
            `${AnswerFieldsProperties.tableName}.${AnswerFieldsProperties.employee_id}`,
            "=",
            db.raw("?", [employeeId]),
          );
        });

    return buildChecklistGroupedWithQuestions(checklistsWithQuestions);
  }
}
