import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";

import db from "database/connection";

import { AnswerFieldsProperties } from "./enums";
import { Answers } from "./entities/asnwers.entity";
import { CreateAnswerDto } from "./dtos/create-answer.dto";
import { QuestionId } from "./dtos/find-params.dto";
import { getChatResponse } from "api/openIa";
import { QuestionFieldsProperties } from "@modules/questions/enums";
import { Anomalies, BaseMessages } from "@shared/enums";
import { Question } from "@modules/questions/entities/question.entity";
import { OpenIA } from "api/openIa/enum";

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

  async createAnswerForSingleQuestion({
    employee_id,
    question_id,
    imageAnswer,
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
        imageAnswer,
        textAnswer,
        anomalyStatus:
          iaAnswer !== BaseMessages.noAnomaly ? iaAnswer : undefined,
      })
      .returning("*");
    return answer;
  }
}
