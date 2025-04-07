import { Injectable } from "@nestjs/common";
import { CheckList } from "./entities/checklist.entity";
import { CreateCheckListDto } from "./dtos/create-checklist.dto";
import db from "database/connection";

import { CheckListFieldsProperties } from "./enums/checkList.enum";

import {
  buildCheckListItemQueryWithJoins,
  buildCheckListWithEmployeeRelatedQueryWithJoins,
  buildQuestionsRelatedQueryWithJoins,
  handleBuildChoicesToInsert,
  handleBuildQuestionsToInsert,
  handleCreateCheckListItem,
  handleCreateMultipleChoice,
  handleCreateQuestion,
} from "./auxliar/auxiliar.func";
import {
  employeeIdDto,
  FindParamsDto,
} from "@modules/checklists/dtos/find-params.dto";
import { CheckListItem } from "./entities/checkListItem.entity";
import { CheckListItemFieldsProperties } from "./enums/checkListItem.enum";
import { CompaniesFieldsProperties } from "@modules/companies/enums";
import {
  CheckListForSpecificEmployee,
  CheckListItemFormattedList,
} from "./dtos/check_list_item.dto";
import {
  ChoicesFieldsProperties,
  QuestionFieldsProperties,
} from "@modules/questions/enums";
import { Question } from "@modules/questions/entities/question.entity";
import { Anomalies } from "./enums/anomaly.enum";

@Injectable()
export class ChecklistsService {
  async create(dto: CreateCheckListDto): Promise<CheckList> {
    return await db.transaction<CheckList>(async (trx) => {
      const [created] = await trx<CheckList>(
        CheckListFieldsProperties.tableName,
      )
        .insert({
          expiries_in: dto.expiries_in,

          name: dto.name,
        })
        .returning("*");

      const checkListItemCreated = await handleCreateCheckListItem(
        dto.checkListItem.map((item) => ({
          categories_id: item.categoriesId,
          checkList_id: created.id,
        })),
        trx,
      );
      const allQuestionsToInsert = handleBuildQuestionsToInsert(
        dto.checkListItem,
        checkListItemCreated,
      );

      const questionsCreated = await handleCreateQuestion(
        allQuestionsToInsert,
        trx,
      );

      if (questionsCreated.some((item) => item.type === "Múltipla escolha")) {
        const choicesToInsert = handleBuildChoicesToInsert(
          dto.checkListItem.map((item) => item.question_list).flat(),
          questionsCreated,
        );

        await handleCreateMultipleChoice(choicesToInsert, trx);
      }

      return created;
    });
  }

  async findPaginatedByParams({
    byCompany,
    endDate,
    startDate,
    limit,
    page,
  }: FindParamsDto): Promise<CheckListItemFormattedList[]> {
    const offset = (Number(page) - 1) * Number(limit);

    const checkListItemList: CheckListItemFormattedList[] =
      await buildCheckListItemQueryWithJoins(
        db<CheckListItem>(CheckListItemFieldsProperties.tableName),
        { byCompany, startDate, endDate },
        Number(limit),
        offset,
      ).select([
        `${CheckListItemFieldsProperties.tableName}.*`,
        `${CompaniesFieldsProperties.tableName}.name as companyName`,
        `${CompaniesFieldsProperties.tableName}.id as companyId`,
        `${CheckListFieldsProperties.tableName}.name as checklistName`,
      ]);

    const questionsRelated: (Question & { anomaly: Anomalies | null })[] =
      await buildQuestionsRelatedQueryWithJoins(
        db<Question>(QuestionFieldsProperties.tableName),
        checkListItemList.map((item) => item.id),
      ).select([
        `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.checkList_id}`,
        `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.anomaly}`,
      ]);

    const checkListItemWithQuestions = checkListItemList.map((item) => {
      const questions = questionsRelated.filter(
        (question) => question.checkListItem_id === item.id,
      );

      return {
        ...item,
        hasAnomalies: questions.some((question) => ({
          anomaly: question.anomaly !== null ? true : false,
        })),
      };
    });

    return checkListItemWithQuestions;
  }

  async findPaginatedByEmployeeResponsible({
    employeeId,
  }: employeeIdDto): Promise<CheckListForSpecificEmployee[]> {
    const checkListItemList: CheckListForSpecificEmployee[] =
      await buildCheckListWithEmployeeRelatedQueryWithJoins(
        db<CheckListItem>(CheckListItemFieldsProperties.tableName),
        employeeId,
      ).select([
        `${CheckListItemFieldsProperties.tableName}.id as checklistId`,
        `${CheckListFieldsProperties.tableName}.name as checklistName`,
      ]);

    return checkListItemList;
  }
}
