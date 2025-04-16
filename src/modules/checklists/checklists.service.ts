import { Injectable, NotFoundException } from "@nestjs/common";
import { CheckList } from "./entities/checklist.entity";
import { CreateCheckListDto } from "./dtos/create-checklist.dto";
import db from "database/connection";

import { CheckListFieldsProperties } from "./enums/checkList.enum";

import {
  buildCheckListItemQueryWithJoins,
  buildCheckListQueryWithJoins,
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
import { Anomalies, BaseMessages } from "@shared/enums";
import { CategoriesFieldsProperties } from "@modules/categories/enums";
import { GroupedCheckList } from "./interfaces/checklist.interface";

@Injectable()
export class ChecklistsService {
  async create(dto: CreateCheckListDto): Promise<CheckList> {
    return await db.transaction<CheckList>(async (trx) => {
      const [created] = await trx<CheckList>(
        CheckListFieldsProperties.tableName,
      )
        .insert({
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
  async findPaginatedCheckList({
    byCompany,
    endDate,
    startDate,
    limit,
    page,
  }: FindParamsDto): Promise<GroupedCheckList[]> {
    const offset = (Number(page) - 1) * Number(limit);

    const checkListItemList: CheckListItemFormattedList[] =
      await buildCheckListQueryWithJoins(
        db<CheckList>(CheckListFieldsProperties.tableName),
        { byCompany, startDate, endDate },
        Number(limit),
        offset,
      ).select([
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.categories_id}`,
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.checkList_id}`,
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.company_id}`,
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.created_at}`,
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.updated_at}`,

        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.id} as checklistItemId`,
        `${CompaniesFieldsProperties.tableName}.name as companyName`,
        `${CompaniesFieldsProperties.tableName}.id as companyId`,
        `${CheckListFieldsProperties.tableName}.name as checklistName`,
      ]);

    const questionsRelated: (Question & { anomaly: Anomalies | null })[] =
      await buildQuestionsRelatedQueryWithJoins(
        db<Question>(QuestionFieldsProperties.tableName),
        checkListItemList.map((item) => item.checklistItemId),
      ).select([
        `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.checkList_id}`,
        `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.anomaly}`,
      ]);

    const checkListItemWithQuestions = checkListItemList.map((item) => {
      const questions = questionsRelated.filter(
        (question) => question.checkListItem_id === item.checklistItemId,
      );

      return {
        ...item,
        hasAnomalies: questions.some((question) => ({
          anomaly: question.anomaly !== null ? true : false,
        })),
      };
    });

    const grouped = checkListItemWithQuestions.reduce(
      (acc: Record<string, GroupedCheckList>, row) => {
        const checklistId = row.checkList_id;

        if (!acc[checklistId]) {
          acc[checklistId] = {
            id: checklistId,
            name: row.checklistName,
            categories_id: row.categories_id,
            hasAnomalies: row.hasAnomalies,
            companies: [],
          };
        }

        acc[checklistId].companies.push({
          id: row.companyId,
          name: row.companyName,
          checklistItemId: row.checklistItemId,
        });

        return acc;
      },
      {} as Record<string, GroupedCheckList>,
    );

    return Object.values(grouped);
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
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.categories_id}`,
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.checkList_id}`,
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.company_id}`,
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.created_at}`,
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.updated_at}`,

        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.id} as checklistItemId`,
        `${CompaniesFieldsProperties.tableName}.name as companyName`,
        `${CompaniesFieldsProperties.tableName}.id as companyId`,
        `${CheckListFieldsProperties.tableName}.name as checklistName`,
      ]);

    const questionsRelated: (Question & { anomaly: Anomalies | null })[] =
      await buildQuestionsRelatedQueryWithJoins(
        db<Question>(QuestionFieldsProperties.tableName),
        checkListItemList.map((item) => item.checklistItemId),
      ).select([
        `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.checkList_id}`,
        `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.anomaly}`,
      ]);

    const checkListItemWithQuestions = checkListItemList.map((item) => {
      const questions = questionsRelated.filter(
        (question) => question.checkListItem_id === item.checklistItemId,
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
        `${CategoriesFieldsProperties.tableName}.name as categoryName`,

        `${CheckListFieldsProperties.tableName}.name as checklistName`,
      ]);

    return checkListItemList;
  }
  async updateExpiriesTime({
    expiries_in,
    checkListId,
    images_expiries_in,
  }: {
    checkListId: string;
    expiries_in: string;
    images_expiries_in?: string;
  }): Promise<CheckList> {
    const checkList = await db<CheckList>(CheckListFieldsProperties.tableName)
      .where({ id: checkListId })
      .first();
    if (!checkList) throw new NotFoundException(BaseMessages.notFound);
    const [updated] = await db<CheckList>(CheckListFieldsProperties.tableName)
      .update({
        expiries_in: new Date(expiries_in),
        ...(images_expiries_in && {
          images_expiries_in: new Date(images_expiries_in),
        }),
      })
      .where({
        id: checkListId,
      })
      .returning("*");

    return updated;
  }
  async updateCompanyRelated({
    companies_id,
    checkListItemId,
  }: {
    checkListItemId: string;
    companies_id: number;
  }): Promise<CheckListItem> {
    const checkListItem = await db<CheckListItem>(
      CheckListItemFieldsProperties.tableName,
    )
      .where({ id: checkListItemId })
      .first();
    if (!checkListItem) throw new NotFoundException(BaseMessages.notFound);
    const [updated] = await db<CheckListItem>(
      CheckListItemFieldsProperties.tableName,
    )
      .update({
        company_id: companies_id,
      })
      .where({
        id: checkListItemId,
      })
      .returning("*");

    return updated;
  }
}
