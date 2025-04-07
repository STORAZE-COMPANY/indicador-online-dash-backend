import { Injectable } from "@nestjs/common";

import db from "database/connection";
import {
  ChoicesFieldsProperties,
  QuestionFieldsProperties,
} from "@modules/questions/enums";
import { Question } from "@modules/questions/entities/question.entity";
import { generateWhereByCheckListItemBuilder } from "./auxiliar/auxiliar.func";
import { choices } from "./dtos/choices.dto";
import { QuestionsWithChoices } from "./dtos/questionsWithChoices.dto";
import { QuestionType } from "@modules/checklists/enums/question-type.enum";

@Injectable()
export class QuestionsService {
  async findQuestionByCheckListItem({
    checkListItemId,
    limit,
    page,
  }: {
    checkListItemId: string;
    page: number;
    limit: number;
  }): Promise<QuestionsWithChoices[]> {
    const offset = (page - 1) * limit;

    const questions = await db<Question>(QuestionFieldsProperties.tableName)
      .where(
        generateWhereByCheckListItemBuilder({
          checkListItemId,
        }),
      )
      .limit(limit)
      .offset(offset);

    const questionsWithChoices = await Promise.all(
      questions.map(async (question) => {
        if (question.type === QuestionType.MULTIPLE_CHOICE) {
          const choices = await db<choices>(
            ChoicesFieldsProperties.tableName,
          ).where({
            question_id: question.id,
          });
          return { ...question, choices };
        }
        return question;
      }),
    );
    return questionsWithChoices;
  }
  async findAll(): Promise<QuestionsWithChoices[]> {
    const questions = await db<Question>(QuestionFieldsProperties.tableName);

    const questionsWithChoices = await Promise.all(
      questions.map(async (question) => {
        if (question.type === QuestionType.MULTIPLE_CHOICE) {
          const choices = await db<choices>(
            ChoicesFieldsProperties.tableName,
          ).where({
            question_id: question.id,
          });
          return { ...question, choices };
        }
        return question;
      }),
    );
    return questionsWithChoices;
  }
}
