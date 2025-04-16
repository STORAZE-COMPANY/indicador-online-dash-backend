import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";

import db from "database/connection";
import { v4 as uuidv4 } from "uuid";

import {
  AnomalyResolutionFieldsProperties,
  AnswerChoiceFieldsProperties,
  AnswerFieldsProperties,
  IaPromptAnswerFieldsProperties,
} from "./enums";
import { AnswerChoice, Answers } from "./entities/asnwers.entity";
import {
  AnswerResponse,
  CreateAnomalyResolutionDTO,
  CreateAnswerChoice,
  CreateAnswerDto,
  CreateAnswerForImageQuestionDto,
} from "./dtos/create-answer.dto";
import { CheckListItemId, QuestionId } from "./dtos/find-params.dto";
import { getChatResponse } from "api/openIa";
import {
  ChoicesFieldsProperties,
  QuestionFieldsProperties,
  QuestionType,
} from "@modules/questions/enums";
import { Anomalies, BaseMessages, smtpMessages } from "@shared/enums";
import { Question } from "@modules/questions/entities/question.entity";
import { OpenIA } from "api/openIa/enum";
import { choices } from "@modules/questions/dtos/choices.dto";

import { IaPromptAnswer } from "./entities/iaPromptAnswer.entity";
import {
  buildAnswerListWithCheckListQueryWithJoins,
  buildAnswerOnAnomalyResolutionQuery,
  buildEmployeesAnomalyResolutionQuery,
  buildMultipleChoiceAnswersQuery,
  formatIaAnswer,
} from "./auxiliar";
import { AnswersWithQuestions } from "./dtos/responses.dto";
import { EmployeesFields } from "@modules/employees/enums";
import { CompaniesFieldsProperties } from "@modules/companies/enums";
import { getSignedImageUrl, uploadImage } from "api/aws/s3Client";
import { s3Buckets } from "api/aws/s3Client/enum";
import {
  multipleChoiceAnswersWithJoin,
  singleQuestionAnswer,
} from "./interfaces";
import { AnomalyResolution } from "./entities/answersResolution.entity";
import { UpdateAnomalyResolutionDTO } from "./dtos/update-answer.dto";
import { Employee } from "@modules/employees/entities/employee.entity";
import { sendEmail } from "@shared/smtp";
import {
  buildHtmlTemplateForAnomalyAlert,
  buildResolutionAlertHtml,
} from "@shared/smtp/aux/html-template";

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
    image,
  }: CreateAnswerForImageQuestionDto): Promise<AnswerResponse> {
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

    const { fileName, url } = await uploadImage({
      bucket: s3Buckets.INDICADOR_ONLINE_IMAGES,
      file: image,
      itemId: uuidv4(),
    });

    const signedUrl = await getSignedImageUrl({
      bucket: s3Buckets.INDICADOR_ONLINE_IMAGES,
      fileName,
    });
    const iaAnswer = await getChatResponse<Anomalies>({
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
              image_url: signedUrl,
              detail: "auto",
            },
          ],
        },
      ],
    });
    const anomalyResponse = formatIaAnswer(iaAnswer);

    const [answer] = await db<Answers>(AnswerFieldsProperties.tableName)
      .insert({
        employee_id: Number(employee_id),
        question_id,
        imageAnswer: url,
        anomalyStatus:
          anomalyResponse === BaseMessages.noAnomaly
            ? undefined
            : anomalyResponse,
      })
      .returning("*");

    await db<IaPromptAnswer>(IaPromptAnswerFieldsProperties.tableName)
      .insert({
        answer_id: answer.id,
        textAnswer: iaAnswer,
      })
      .returning("*");

    if (anomalyResponse !== BaseMessages.noAnomaly) {
      const employee = await db<Employee>(EmployeesFields.tableName)
        .where({ id: Number(employee_id) })
        .first();

      if (!employee) throw new NotFoundException(BaseMessages.notFound);

      await sendEmail({
        to: employee.email,
        subject: smtpMessages.anomalyAlert,
        text: "",
        html: buildHtmlTemplateForAnomalyAlert({
          questionRelatedToAnomaly: questionExist.question,
          anomaly: iaAnswer,
        }),
      });
    }

    return {
      ...answer,
      openIaResponse: iaAnswer,
    };
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
  }: CreateAnswerDto): Promise<AnswerResponse> {
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

    const anomalyResponse = formatIaAnswer(iaAnswer);

    const [answer] = await db<Answers>(AnswerFieldsProperties.tableName)
      .insert({
        employee_id: Number(employee_id),
        question_id,
        textAnswer,
        anomalyStatus:
          anomalyResponse === BaseMessages.noAnomaly
            ? undefined
            : anomalyResponse,
      })
      .returning("*");

    await db<IaPromptAnswer>(IaPromptAnswerFieldsProperties.tableName)
      .insert({
        answer_id: answer.id,
        textAnswer: iaAnswer,
      })
      .returning("*");
    return {
      ...answer,
      openIaResponse: iaAnswer,
    };
  }

  async createResolutionForAnomaly({
    answer_id,
    description,
    image,
  }: CreateAnomalyResolutionDTO): Promise<AnomalyResolution> {
    const answerExist: Answers & { question: string; anomalyRelated: string } =
      await buildAnswerOnAnomalyResolutionQuery({
        base: db<Answers>(AnswerFieldsProperties.tableName),
        answer_id,
      })
        .first()
        .select(
          `${AnswerFieldsProperties.tableName}.*`,
          `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.question} as question`,
          `${IaPromptAnswerFieldsProperties.tableName}.${IaPromptAnswerFieldsProperties.textAnswer} as anomalyRelated`,
        );

    if (!answerExist) throw new NotFoundException(BaseMessages.notFound);

    let imageUrl: string | undefined = undefined;

    if (image) {
      const { url } = await uploadImage({
        bucket: s3Buckets.INDICADOR_ONLINE_IMAGES,
        file: image,
        itemId: uuidv4(),
      });
      imageUrl = url;
    }
    const [resolution] = await db<AnomalyResolution>(
      AnomalyResolutionFieldsProperties.tableName,
    )
      .insert({
        answer_id,
        description,
        imageUrl,
      })
      .returning("*");

    const [employee] = await db<Employee>(EmployeesFields.tableName)
      .where({
        id: answerExist.employee_id,
      })
      .returning("*");

    const employees: Employee[] = await buildEmployeesAnomalyResolutionQuery({
      base: db<Employee>(EmployeesFields.tableName),
      companyId: employee.company_id,
    }).select(`${EmployeesFields.tableName}.*`);

    for (const employee of employees) {
      await sendEmail({
        to: employee.email,
        subject: smtpMessages.anomalyAlert,
        text: "",
        html: buildResolutionAlertHtml({
          employeeName: employee.name,
          questionRelatedToAnomaly: answerExist.anomalyRelated,
        }),
      });
    }

    return resolution;
  }

  async updateResolutionForAnomaly({
    id,
    employee_Id,
    status,
  }: UpdateAnomalyResolutionDTO) {
    const [resolutionExist] = await db<AnomalyResolution>(
      AnomalyResolutionFieldsProperties.tableName,
    )
      .where({ id })
      .returning("*");

    if (!resolutionExist) throw new NotFoundException(BaseMessages.notFound);

    const [resolution] = await db<AnomalyResolution>(
      AnomalyResolutionFieldsProperties.tableName,
    )
      .where({ id })
      .update({
        status,
        updated_by: employee_Id,
      })
      .returning("*");

    return resolution;
  }

  async findAnomalyResolutionList(): Promise<AnomalyResolution[]> {
    const resolutions: AnomalyResolution[] = await db<AnomalyResolution>(
      AnomalyResolutionFieldsProperties.tableName,
    ).select("*");

    return resolutions;
  }

  async findAnomalyResolutionByAnswerId(
    answer_id: string,
  ): Promise<AnomalyResolution> {
    const [resolution] = await db<AnomalyResolution>(
      AnomalyResolutionFieldsProperties.tableName,
    )
      .where({ answer_id })
      .returning("*");

    return resolution;
  }

  async findAnswerWithCheckList({
    checkList_id,
  }: CheckListItemId): Promise<AnswersWithQuestions[]> {
    console.log("checkList_id", checkList_id);
    const answers: singleQuestionAnswer[] =
      await buildAnswerListWithCheckListQueryWithJoins({
        base: db<Answers>(AnswerFieldsProperties.tableName),
        checkListItemId: checkList_id,
      }).select([
        `${AnswerFieldsProperties.tableName}.*`,
        `${EmployeesFields.tableName}.name as employeeName`,
        `${CompaniesFieldsProperties.tableName}.name as companyName`,
        `${QuestionFieldsProperties.tableName}.question as question`,
        `${QuestionFieldsProperties.tableName}.type as type`,
      ]);

    const multipleChoiceAnswers: multipleChoiceAnswersWithJoin[] =
      await buildMultipleChoiceAnswersQuery({
        base: db<AnswerChoice>(AnswerChoiceFieldsProperties.tableName),
        checkListItemId: checkList_id,
      }).select([
        `${AnswerChoiceFieldsProperties.tableName}.*`,
        `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.choice} as answer`,
        `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.id} as choice_id`,
        `${ChoicesFieldsProperties.tableName}.anomalyStatus as anomalyStatus`,
        `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.id} as question_id`,
        `${EmployeesFields.tableName}.name as employeeName`,
        `${CompaniesFieldsProperties.tableName}.name as companyName`,
        `${QuestionFieldsProperties.tableName}.question as question`,
        `${QuestionFieldsProperties.tableName}.type as type`,
      ]);
    const answersWithFlagHasAnomaly: AnswersWithQuestions[] = answers.map(
      (answer) => {
        const hasAnomaly = answer.anomalyStatus !== null ? true : false;

        return {
          id: answer.id,
          question: answer.question,
          answer: answer.textAnswer || answer.imageAnswer || "",
          question_id: answer.question_id,
          companyName: answer.companyName,
          employeeName: answer.employeeName,
          created_at: answer.created_at,
          updated_at: answer.updated_at,
          employee_id: answer.employee_id,
          anomalyStatus: answer.anomalyStatus || undefined,
          type: answer.type,
          hasAnomaly,
        };
      },
    );

    const multipleChoiceAnswersWithFlagHasAnomaly: AnswersWithQuestions[] =
      multipleChoiceAnswers.map((answer) => {
        const hasAnomaly = answer.anomalyStatus !== null ? true : false;

        return {
          id: answer.id,
          question: answer.question,
          answer: answer.answer,
          question_id: answer.question_id,
          companyName: answer.companyName,
          employeeName: answer.employeeName,
          created_at: answer.created_at,
          updated_at: answer.updated_at,
          employee_id: answer.employee_id,
          anomalyStatus: answer.anomalyStatus || undefined,
          type: answer.type,
          hasAnomaly,
        };
      });

    return [
      answersWithFlagHasAnomaly,
      multipleChoiceAnswersWithFlagHasAnomaly,
    ].flat();
  }
}
