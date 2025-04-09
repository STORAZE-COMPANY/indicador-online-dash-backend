import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";

import db from "database/connection";

import { AnswerChoiceFieldsProperties, AnswerFieldsProperties } from "./enums";
import { AnswerChoice, Answers } from "./entities/asnwers.entity";
import {
  CreateAnswerChoice,
  CreateAnswerDto,
  CreateAnswerForImageQuestionDto,
} from "./dtos/create-answer.dto";
import { QuestionId } from "./dtos/find-params.dto";
import { getChatResponse } from "api/openIa";
import {
  ChoicesFieldsProperties,
  QuestionFieldsProperties,
  QuestionType,
} from "@modules/questions/enums";
import { Anomalies, BaseMessages } from "@shared/enums";
import { Question } from "@modules/questions/entities/question.entity";
import { OpenIA } from "api/openIa/enum";
import { choices } from "@modules/questions/dtos/choices.dto";

@Injectable()
export class AnswersService {
  async findAllAnswers(): Promise<Answers[]> {
    return await db<Answers>(AnswerFieldsProperties.tableName);
  }

  async findAnswerByQuestionId({
    limit,
    page,
    question_id,
  }: QuestionId): Promise<Answers[]> {
    const limitNumber = Number(limit);
    const offset = (Number(page) - 1) * limitNumber;
    return await db<Answers>(AnswerFieldsProperties.tableName)
      .where(AnswerFieldsProperties.question_id, question_id)
      .offset(offset)
      .limit(limitNumber);
  }

  async createAnswerForImageQuestion({
    employee_id,
    question_id,
    imageAnswer,
  }: CreateAnswerForImageQuestionDto): Promise<Answers> {
    const [questionExist] = await db<Question>(
      QuestionFieldsProperties.tableName,
    )
      .where({ id: question_id })
      .returning("*");
    if (!questionExist) throw new NotFoundException(BaseMessages.notFound);
    if (
      !questionExist.IAPrompt ||
      questionExist.type !== QuestionType.FILE_UPLOAD
    )
      throw new UnprocessableEntityException(BaseMessages.requiredFields);

    const iaAnswer = await getChatResponse<Anomalies | BaseMessages.noAnomaly>({
      inputDataToSend: [
        {
          role: OpenIA.ia_system,
          content: questionExist.IAPrompt,
        },
        {
          role: OpenIA.user,
          content: [
            {
              type: "input_image",
              image_url: imageAnswer,
              detail: "auto",
            },
          ],
        },
      ],
    });

    if (
      iaAnswer !== Anomalies.anomaly &&
      iaAnswer !== Anomalies.anomaly_restricted &&
      iaAnswer !== BaseMessages.noAnomaly
    )
      throw new UnprocessableEntityException(
        BaseMessages.iaResponseNotExpected,
        iaAnswer,
      );

    const [answer] = await db<Answers>(AnswerFieldsProperties.tableName)
      .insert({
        employee_id: Number(employee_id),
        question_id,
        imageAnswer,
        anomalyStatus:
          iaAnswer !== BaseMessages.noAnomaly ? iaAnswer : undefined,
      })
      .returning("*");
    return answer;
  }
  async createAnswerForMultipleChoiceQuestion({
    choice_id,
    employee_id,
  }: CreateAnswerChoice): Promise<AnswerChoice> {
    const [choiceExist] = await db<choices>(ChoicesFieldsProperties.tableName)
      .where({ id: choice_id })
      .returning("*");
    if (!choiceExist) throw new NotFoundException(BaseMessages.notFound);

    const alreadyAnswered = await db<AnswerChoice>(
      AnswerChoiceFieldsProperties.tableName,
    )
      .where({
        choice_id: choiceExist.id,
      })
      .first();
    if (alreadyAnswered)
      throw new UnprocessableEntityException(BaseMessages.alreadyAnswered);

    const [answer] = await db<AnswerChoice>(
      AnswerChoiceFieldsProperties.tableName,
    )
      .insert({
        choice_id: choice_id,
        employee_id: employee_id,
      })
      .returning("*");

    return answer;
  }
  async createAnswerForSingleQuestion({
    employee_id,
    question_id,

    textAnswer,
  }: CreateAnswerDto): Promise<Answers> {
    const [questionExist] = await db<Question>(
      QuestionFieldsProperties.tableName,
    )
      .where({ id: question_id })
      .returning("*");
    if (!questionExist) throw new NotFoundException(BaseMessages.notFound);
    if (!questionExist.IAPrompt || !textAnswer)
      throw new UnprocessableEntityException(BaseMessages.requiredFields);

    const [alreadyAnswered] = await db<Answers>(
      AnswerFieldsProperties.tableName,
    )
      .where({
        question_id: question_id,
      })
      .returning("*");
    if (alreadyAnswered)
      throw new UnprocessableEntityException(BaseMessages.alreadyAnswered);
    const iaAnswer = await getChatResponse<Anomalies | BaseMessages.noAnomaly>({
      inputDataToSend: [
        {
          role: OpenIA.ia_system,
          content: questionExist.IAPrompt,
        },
        {
          role: OpenIA.user,
          content: [
            {
              type: "input_text",
              text: textAnswer,
            },
          ],
        },
      ],
    });

    if (
      iaAnswer !== Anomalies.anomaly &&
      iaAnswer !== Anomalies.anomaly_restricted &&
      iaAnswer !== BaseMessages.noAnomaly
    )
      throw new UnprocessableEntityException(
        BaseMessages.iaResponseNotExpected,
        iaAnswer,
      );

    const [answer] = await db<Answers>(AnswerFieldsProperties.tableName)
      .insert({
        employee_id: Number(employee_id),
        question_id,

        textAnswer,
        anomalyStatus:
          iaAnswer !== BaseMessages.noAnomaly ? iaAnswer : undefined,
      })
      .returning("*");
    return answer;
  }
}
