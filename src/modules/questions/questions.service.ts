import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";

import db from "database/connection";
import {
  ChoicesFieldsProperties,
  QuestionFieldsProperties,
  QuestionsMessages,
} from "@modules/questions/enums";
import { Question } from "@modules/questions/entities/question.entity";
import { buildFindQuestionByCheckListQuery } from "./auxiliar/auxiliar.func";
import { choices } from "./dtos/choices.dto";
import { QuestionsWithChoices } from "./dtos/questionsWithChoices.dto";
import { QuestionType } from "@modules/checklists/enums/question-type.enum";
import { QuestionDto } from "./dtos/createQuestionDto";
import { BaseMessages } from "@shared/enums";
import { UpdateQuestion } from "./dtos/updateQuestion.dto";

@Injectable()
export class QuestionsService {
  async findQuestionByCheckList({
    checklistId,
    limit,
    page,
  }: {
    checklistId: string;
    page: number;
    limit: number;
  }): Promise<QuestionsWithChoices[]> {
    const offset = (page - 1) * limit;

    const questions: Question[] = await buildFindQuestionByCheckListQuery({
      Knek: db<Question>(QuestionFieldsProperties.tableName),
      checklistId,
    })
      .limit(limit)
      .offset(offset)
      .select([`${QuestionFieldsProperties.tableName}.*`]);

    const questionsWithChoices = await Promise.all(
      questions.map(async (question) => {
        if (question.type === (QuestionType.MULTIPLE_CHOICE as QuestionType)) {
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
        if (question.type === (QuestionType.MULTIPLE_CHOICE as QuestionType)) {
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
        checklist_id: question.checklist_id,
        question: question.question,
        type: question.type,
        isRequired: question.isRequired,
        answerType: question.answerType,
        IAPrompt: question.IAPrompt,

        category_id: question.category_id,
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
  async update(questionToUpdate: UpdateQuestion): Promise<Question> {
    const { questionId, ...questionData } = questionToUpdate;

    const questionExist = await db<Question>(QuestionFieldsProperties.tableName)
      .where({ id: questionId })
      .first();
    if (!questionExist) throw new NotFoundException(BaseMessages.notFound);

    const [questionUpdated] = await db<Question>(
      QuestionFieldsProperties.tableName,
    )
      .update({
        ...questionData,
      })
      .where({
        id: questionId,
      })
      .returning("*");

    return questionUpdated;
  }
  async delete(
    questionId: string,
  ): Promise<{ message: QuestionsMessages.successDelete }> {
    const questionExist = await db<Question>(QuestionFieldsProperties.tableName)
      .where({ id: questionId })
      .first();
    if (!questionExist) throw new NotFoundException(BaseMessages.notFound);

    await db<Question>(QuestionFieldsProperties.tableName).delete().where({
      id: questionId,
    });
    return {
      message: QuestionsMessages.successDelete,
    };
  }
}
