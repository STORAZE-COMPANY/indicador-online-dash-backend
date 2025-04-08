import { Injectable, UnprocessableEntityException } from "@nestjs/common";

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
import { QuestionDto } from "./dtos/createQuestionDto";
import { BaseMessages } from "@shared/enums";

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

  async create(question: QuestionDto): Promise<Question> {
    const [createdQuestion] = await db<Question>(
      QuestionFieldsProperties.tableName,
    )
      .insert({
        checkListItem_id: question.checkListItem_id,
        question: question.question,
        type: question.type,
        isRequired: question.isRequired,
        answerType: question.answerType,
        IAPrompt: question.IAPrompt,
      })
      .returning("*");

    if (!createdQuestion)
      throw new UnprocessableEntityException(BaseMessages.errorOnCreate);

    if (
      question.type === (QuestionType.MULTIPLE_CHOICE as QuestionType) &&
      question.choices
    ) {
      const choices = question.choices.map((choice) => ({
        choice: choice.choice,
        anomalyStatus: choice.anomaly,
        question_id: createdQuestion.id,
      }));

      const createdChoices = await db<choices>(
        ChoicesFieldsProperties.tableName,
      )
        .insert(choices)
        .returning("*");

      if (createdChoices.length === 0)
        throw new UnprocessableEntityException(BaseMessages.errorOnCreate);
    }

    return createdQuestion;
  }
}
