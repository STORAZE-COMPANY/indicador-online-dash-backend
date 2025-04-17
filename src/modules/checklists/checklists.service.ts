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
import { GroupedCheckList } from "./interfaces/checklist.interface";
import {
  batchConnectCheckListQuestionsToEmployeeDto,
  BatchConnectCompanyToChecklistDto,
} from "./dtos/batch.dto";
import { UpdateChecklistDto } from "./dtos/update-checklist.dto";
import { CheckListDto } from "./dtos/find.dto";

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

      const allQuestionsToInsert = handleBuildQuestionsToInsert({
        questionsDto: dto.question_list,
        checklistId: created.id,
      });

      const questionsCreated = await handleCreateQuestion(
        allQuestionsToInsert,
        trx,
      );

      if (questionsCreated.some((item) => item.type === "Múltipla escolha")) {
        const choicesToInsert = handleBuildChoicesToInsert(
          dto.question_list.map((item) => item),
          questionsCreated,
        );

        await handleCreateMultipleChoice(choicesToInsert, trx);
      }

      return created;
    });
  }
  async findAll(): Promise<CheckListDto[]> {
    const checkListItemList: CheckListDto[] = await db<CheckList>(
      CheckListFieldsProperties.tableName,
    ).select([`${CheckListFieldsProperties.tableName}.*`]);

    const questions: Question[] = await db<Question>(
      QuestionFieldsProperties.tableName,
    )
      .whereIn(
        `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.checkList_id}`,
        checkListItemList.map((item) => item.id),
      )
      .select([`${QuestionFieldsProperties.tableName}.*`]);

    return checkListItemList.map((item) => {
      const questionsRelated = questions.filter(
        (question) => question.checklist_id === item.id,
      );

      return {
        ...item,
        questions: questionsRelated,
      };
    });
  }
  async findPaginatedCheckList({
    byCompany,
    endDate,
    startDate,
    limit,
    page,
    query,
  }: FindParamsDto): Promise<GroupedCheckList[]> {
    const offset = (Number(page) - 1) * Number(limit);

    const checkListItemList: CheckListItemFormattedList[] =
      await buildCheckListQueryWithJoins(
        db<CheckList>(CheckListFieldsProperties.tableName),
        { byCompany, startDate, endDate, query },
        Number(limit),
        offset,
      ).select([
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.checkList_id}`,
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.company_id}`,
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.created_at}`,
        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.updated_at}`,

        `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.id} as checklistItemId`,
        `${CompaniesFieldsProperties.tableName}.name as companyName`,
        `${CompaniesFieldsProperties.tableName}.id as companyId`,
        `${CheckListFieldsProperties.tableName}.name as checklistName`,
        `${CheckListFieldsProperties.tableName}.id as checkList_id`,
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
      if (!item.checkList_id) return item;
      const questions = questionsRelated.filter(
        (question) => question.checklist_id === item.checkList_id,
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
            companies: [],
          };
        }

        acc[checklistId].companies.push({
          id: row.companyId,
          name: row.companyName,
          hasAnomalies: row.hasAnomalies,
          checklistItem_id: row.checklistItemId,
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
      if (!item.checklistItemId) return item;
      const questions = questionsRelated.filter(
        (question) => question.checklist_id === item.checklistItemId,
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
    query,
  }: employeeIdDto): Promise<CheckListForSpecificEmployee[]> {
    const checkListItemList: CheckListForSpecificEmployee[] =
      await buildCheckListWithEmployeeRelatedQueryWithJoins(
        db<CheckList>(CheckListFieldsProperties.tableName),
        employeeId,
        query,
      ).select([
        `${CheckListFieldsProperties.tableName}.id as checklistId`,
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
  async updateCompanyRelatedBatch(
    params: BatchConnectCompanyToChecklistDto[],
  ): Promise<void> {
    await Promise.all(
      params.map(async ({ checklistId, companyId }) => {
        await db<CheckListItem>(CheckListItemFieldsProperties.tableName).insert(
          {
            company_id: companyId,
            checkList_id: checklistId,
          },
        );
      }),
    );
  }

  async batchConnectCheckListQuestionsToEmployee({
    checklistId,
    employee_id,
  }: batchConnectCheckListQuestionsToEmployeeDto) {
    const checkList = await db<CheckList>(
      CheckListFieldsProperties.tableName,
    ).where({ id: checklistId });

    if (!checkList) throw new NotFoundException(BaseMessages.notFound);

    const [questionsUpdated] = await db<Question>(
      QuestionFieldsProperties.tableName,
    )
      .whereIn(
        `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.checkList_id}`,
        checkList.map((item) => item.id),
      )
      .update({
        employee_id,
      })
      .returning("*");

    return questionsUpdated;
  }

  async updateCheckList({ checkListId, name }: UpdateChecklistDto) {
    const checkList = await db<CheckList>(CheckListFieldsProperties.tableName)
      .where({ id: checkListId })
      .first();
    if (!checkList) throw new NotFoundException(BaseMessages.notFound);

    const [updated] = await db<CheckList>(CheckListFieldsProperties.tableName)
      .update({
        name,
      })
      .where({
        id: checkListId,
      })
      .returning("*");

    return updated;
  }
}
