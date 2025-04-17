import { Knex } from "knex";
import { CreateCheckListItemDto } from "../dtos/check_list_item.dto";
import { CheckListQuestionsDto } from "../dtos/question.dto";
import {
  CheckListMultipleChoice,
  CheckListQuestions,
} from "../entities/checklist.entity";
import { CheckListItem } from "../entities/checkListItem.entity";
import {
  CheckListMultipleChoiceFieldsProperties,
  CheckListQuestionFieldsProperties,
  QuestionType,
} from "../enums/question-type.enum";
import { QuestionsFormatted } from "../interfaces/questions.interface";
import { checkListMessages } from "../enums/messages.enum";
import { InternalServerErrorException } from "@nestjs/common";
import { CheckListItemFieldsProperties } from "../enums/checkListItem.enum";
import { Anomalies } from "@shared/enums";
import { CompaniesFieldsProperties } from "@modules/companies/enums";
import { CheckListFieldsProperties } from "../enums/checkList.enum";
import {
  ChoicesFieldsProperties,
  QuestionFieldsProperties,
} from "@modules/questions/enums";
import { Question } from "@modules/questions/entities/question.entity";
import { FindParamsDto } from "../dtos/find-params.dto";
import { EmployeesFields } from "@modules/employees/enums";
import { Employee } from "@modules/employees/entities/employee.entity";
import { CategoriesFieldsProperties } from "@modules/categories/enums";

/**
 * Cria um item de checklist no banco de dados utilizando uma transação.
 *
 * @param checkListItem - Objeto parcial contendo os dados do item de checklist a ser criado.
 * @param trx - Instância da transação do Knex para garantir atomicidade na operação.
 * @returns Uma Promise que resolve para o item de checklist criado.
 * @throws InternalServerErrorException - Caso o item de checklist não seja criado com sucesso.
 */
export async function handleCreateCheckListItem(
  checkListItem: Partial<CheckListItem>[],
  trx: Knex.Transaction,
): Promise<CheckListItem[]> {
  const created = await trx<CheckListItem>(
    CheckListItemFieldsProperties.tableName,
  )
    .insert(checkListItem)
    .returning("*");

  if (!created)
    throw new InternalServerErrorException(
      checkListMessages.checkListItemNotCreated,
    );
  return created;
}

/**
 * Lida com a criação de perguntas associadas a um item de checklist.
 *
 * @param questions - Array de objetos contendo os dados das perguntas a serem criadas.
 * @param questions[].checkListItem_id - ID do item de checklist ao qual a pergunta está associada.
 * @param questions[].question - Texto da pergunta.
 * @param questions[].type - Tipo da pergunta (definido pelo enum `QuestionType`).
 * @param questions[].isRequired - Indica se a pergunta é obrigatória.
 * @param trx - Transação do Knex utilizada para garantir atomicidade na operação.
 * @returns Uma Promise que resolve para um array de objetos contendo o ID e o tipo das perguntas criadas.
 * @throws InternalServerErrorException - Caso ocorra um erro ao criar as perguntas.
 */
export async function handleCreateQuestion(
  questions: {
    checkListItem_id: string;
    question: string;
    type: QuestionType;
    isRequired: boolean;
  }[],
  trx: Knex.Transaction,
): Promise<{ id: string; type: string }[]> {
  const created = await trx<CheckListQuestions>(
    CheckListQuestionFieldsProperties.tableName,
  )
    .insert(questions)
    .returning(["id", "question", "type"]);

  if (!created)
    throw new InternalServerErrorException(
      checkListMessages.questionNotCreated,
    );
  return created;
}

/**
 * Lida com a criação de múltiplas escolhas associadas a uma pergunta em um checklist.
 *
 * @param multipleChoice - Um array de objetos contendo as informações de cada escolha múltipla.
 *   - `choice` (string): O texto da escolha.
 *   - `isAnomaly` (boolean): Indica se a escolha representa uma anomalia.
 *   - `question_id` (string): O ID da pergunta associada à escolha.
 * @param trx - A transação do Knex a ser utilizada para a operação no banco de dados.
 *
 * @returns Retorna o objeto da escolha múltipla criada.
 *
 * @throws InternalServerErrorException - Lançada caso a criação da escolha múltipla falhe.
 */
export async function handleCreateMultipleChoice(
  multipleChoice: {
    choice: string;
    anomalyStatus?: Anomalies | null;
    question_id: string;
  }[],
  trx: Knex.Transaction,
) {
  const [multipleChoiceCreated] = await trx<CheckListMultipleChoice>(
    CheckListMultipleChoiceFieldsProperties.tableName,
  )
    .insert(multipleChoice)
    .returning("*");

  if (!multipleChoiceCreated)
    throw new InternalServerErrorException(
      checkListMessages.multipleChoiceNotCreated,
    );
  return multipleChoiceCreated;
}

/**
 * Manipula a construção de perguntas a serem inseridas no banco de dados.
 *
 * Este método recebe uma lista de DTOs de perguntas e uma lista de itens de checklist criados,
 * e formata as perguntas para serem inseridas no banco de dados, associando cada pergunta ao
 * respectivo item de checklist criado.
 *
 * @param questionsDto - Uma lista de objetos do tipo `CreateCheckListItemDto` que contém as informações
 * das perguntas a serem associadas aos itens de checklist.
 * @param checkListItemCreated - Uma lista de objetos do tipo `CheckListItem` que representam os itens
 * de checklist já criados e que serão associados às perguntas.
 *
 * @returns Um array de objetos do tipo `QuestionsFormatted`, onde cada objeto representa uma pergunta
 * formatada e associada ao respectivo item de checklist.
 *
 */
export function handleBuildQuestionsToInsert(
  questionsDto: CreateCheckListItemDto[],
  checkListItemCreated: CheckListItem[],
): QuestionsFormatted[] {
  const allQuestionsToInsert: QuestionsFormatted[] = [];

  questionsDto.forEach((item, index) => {
    const relatedCheckListItem = checkListItemCreated[index];
    const questions = item.question_list.map((item) => ({
      checkListItem_id: relatedCheckListItem.id,
      isRequired: item.isRequired,
      question: item.question,
      answerType: item.answerType,
      type: item.type,
      IAPrompt: item.iaPrompt,
    }));
    allQuestionsToInsert.push(...questions);
  });
  return allQuestionsToInsert;
}
/**
 * Processa uma lista de perguntas e suas escolhas múltiplas para inserção no banco de dados.
 *
 * @param questionList - Lista de perguntas do tipo `CheckListQuestionsDto` contendo os dados originais das perguntas.
 * @param questionsListAfterInsert - Lista de perguntas já inseridas no banco de dados, contendo os campos `id` e `type`.
 *
 * @returns Uma lista de escolhas múltiplas (`CheckListMultipleChoice[]`) formatadas para inserção,
 *          contendo as informações de escolha, se é uma anomalia e o ID da pergunta associada.
 *
 * @remarks
 * - Apenas perguntas do tipo `MULTIPLE_CHOICE` são processadas.
 * - Cada escolha múltipla é associada ao ID da pergunta correspondente.
 * - O método utiliza o índice das perguntas para mapear os IDs gerados após a inserção.
 */
export function handleBuildChoicesToInsert(
  questionList: CheckListQuestionsDto[],
  questionsListAfterInsert: {
    id: string;
    type: string;
  }[],
): CheckListMultipleChoice[] {
  const questionsWithIds = questionsListAfterInsert
    .map((question, index) => ({
      ...questionList[index],
      id: question.id,
      type: question.type as QuestionType,
    }))
    .filter((question) => question.type === QuestionType.MULTIPLE_CHOICE);

  return questionsWithIds
    .map((item) =>
      (item.multiple_choice || []).map((choice) => ({
        choice: choice.choice,
        anomalyStatus: choice.anomalyStatus,
        question_id: item.id,
      })),
    )
    .flat();
}

/**
 * Constrói uma consulta SQL para buscar itens de checklist com junções e filtros opcionais.
 *
 * @param base - O construtor de consulta do Knex que serve como base para a query.
 * @param params - Parâmetros opcionais para filtrar os resultados da consulta.
 *   - `byCompany` (opcional): Filtra os itens de checklist associados a uma empresa específica.
 * @param limit - O número máximo de registros a serem retornados.
 * @param offset - O deslocamento para paginação dos resultados.
 *
 * @returns Uma consulta Knex configurada com junções, filtros e paginação.
 *
 * ### Detalhes das junções:
 * - Realiza uma junção à esquerda (`leftJoin`) entre a tabela de propriedades de campos de empresas
 *   (`CompaniesFieldsProperties`) e a tabela de itens de checklist (`CheckListItemFieldsProperties`),
 *   utilizando a relação entre `checkListItem_Id` na tabela de empresas e o campo `id` na tabela de itens de checklist.
 * - Realiza uma junção interna (`join`) entre a tabela de checklists (`CheckListFieldsProperties`) e a tabela de itens
 *   de checklist (`CheckListItemFieldsProperties`), utilizando a relação entre o campo `id` na tabela de checklists
 *   e o campo `checkList_id` na tabela de itens de checklist.
 *
 * ### Detalhes do filtro:
 * - Caso o parâmetro `byCompany` seja fornecido, aplica um filtro na consulta para retornar apenas os itens de checklist
 *   associados à empresa cujo `id` corresponde ao valor de `byCompany`.
 *
 * ### Paginação:
 * - Limita o número de registros retornados com base no valor de `limit`.
 * - Define o deslocamento inicial dos registros retornados com base no valor de `offset`.
 */
export function buildCheckListItemQueryWithJoins(
  base: Knex.QueryBuilder,
  params: Partial<FindParamsDto>,
  limit: number,
  offset: number,
) {
  return base
    .leftJoin(
      CompaniesFieldsProperties.tableName,
      `${CompaniesFieldsProperties.tableName}.id`,
      `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.company_id}`,
    )
    .join(
      CheckListFieldsProperties.tableName,
      `${CheckListFieldsProperties.tableName}.id`,
      `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.checkList_id}`,
    )

    .where((builder) => {
      if (params.byCompany) {
        builder.where(
          `${CheckListItemFieldsProperties.company_id}`,
          params.byCompany,
        );
      }
      if (params.startDate && params.endDate) {
        builder.whereBetween(
          `${CheckListItemFieldsProperties.tableName}.created_at`,
          [params.startDate, params.endDate],
        );
      }
      if (params.query) {
        builder.where(
          `${CheckListFieldsProperties.tableName}.name`,
          "ilike",
          `%${params.query}%`,
        );
      }
    })
    .limit(limit)
    .offset(offset);
}
export function buildCheckListQueryWithJoins(
  base: Knex.QueryBuilder,
  params: Partial<FindParamsDto>,
  limit: number,
  offset: number,
) {
  return base
    .join(
      CheckListItemFieldsProperties.tableName,
      `${CheckListFieldsProperties.tableName}.id`,
      `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.checkList_id}`,
    )
    .leftJoin(
      CompaniesFieldsProperties.tableName,
      `${CompaniesFieldsProperties.tableName}.id`,
      `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.company_id}`,
    )

    .where((builder) => {
      if (params.byCompany) {
        builder.where(
          `${CheckListItemFieldsProperties.company_id}`,
          params.byCompany,
        );
      }
      if (params.startDate && params.endDate) {
        builder.whereBetween(
          `${CheckListItemFieldsProperties.tableName}.created_at`,
          [params.startDate, params.endDate],
        );
      }
      if (params.query) {
        builder.where(
          `${CheckListFieldsProperties.tableName}.name`,
          "ilike",
          `%${params.query}%`,
        );
      }
    })
    .limit(limit)
    .offset(offset);
}
/**
 * Constrói uma consulta SQL com junções relacionadas a perguntas e aplica filtros específicos.
 *
 * @param base - Um objeto `Knex.QueryBuilder` que serve como base para a construção da consulta.
 * @param checkListItemIds - Um array de strings contendo os IDs dos itens de checklist que serão usados como filtro.
 * @returns Um objeto `Knex.QueryBuilder` representando a consulta SQL construída com as junções e filtros aplicados.
 *
 * A consulta realiza uma junção à esquerda entre a tabela de propriedades de escolhas (`ChoicesFieldsProperties`)
 * e a tabela de propriedades de perguntas (`QuestionFieldsProperties`), utilizando o campo `question_id` como chave.
 * Em seguida, aplica um filtro para selecionar apenas as perguntas que pertencem aos itens de checklist especificados
 * e que possuem o tipo `MULTIPLE_CHOICE`.
 */
export function buildQuestionsRelatedQueryWithJoins(
  base: Knex.QueryBuilder,
  checkListItemIds: string[],
  hasAnomalies?: boolean,
): Knex.QueryBuilder {
  return base
    .leftJoin(
      ChoicesFieldsProperties.tableName,
      `${ChoicesFieldsProperties.tableName}.question_id`,
      `${QuestionFieldsProperties.tableName}.id`,
    )
    .where((builder: Knex.QueryBuilder<Question>) => {
      builder
        .whereIn("checkListItem_id", checkListItemIds)
        .andWhere("type", QuestionType.MULTIPLE_CHOICE);
      if (hasAnomalies) {
        builder.where(
          `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.anomaly}`,
          hasAnomalies,
        );
      }
    });
}

/**
 * Constrói uma query SQL utilizando o Knex.js para buscar informações relacionadas a checklists,
 * questões, escolhas e funcionários, com base no ID de um funcionário específico. A query inclui
 * múltiplos joins entre tabelas relacionadas e aplica um filtro para limitar os resultados ao
 * funcionário especificado.
 *
 * @param base - O objeto `Knex.QueryBuilder` base que será utilizado para construir a query.
 *               Geralmente, este é o ponto de partida para a construção de queries no Knex.js.
 * @param employeeId - O ID do funcionário que será utilizado como critério de filtro na query.
 *                     Apenas os registros relacionados a este funcionário serão retornados.
 *
 * @returns Um objeto `Knex.QueryBuilder` que representa a query SQL construída, incluindo os joins
 *          e filtros aplicados. A query resultante é distinta para evitar duplicação de registros.
 *
 * ### Estrutura da Query:
 * - Realiza joins entre as tabelas:
 *   - `CheckListFieldsProperties` e `CheckListItemFieldsProperties` com base no campo `checkList_id`.
 *   - `QuestionFieldsProperties` e `CheckListItemFieldsProperties` com base no campo `id`.
 *   - `EmployeesFields` e `QuestionFieldsProperties` com base no campo `questionId`.
 *   - `ChoicesFieldsProperties` e `QuestionFieldsProperties` com base no campo `question_id` (join à esquerda).
 * - Aplica um filtro para garantir que apenas registros relacionados ao `employeeId` especificado sejam retornados.
 * - Garante que os resultados sejam distintos.
 *
 * ### Uso:
 * Esta função é útil em cenários onde é necessário buscar informações detalhadas sobre checklists
 * e suas relações com questões, escolhas e funcionários, filtrando por um funcionário específico.
 */
export function buildCheckListWithEmployeeRelatedQueryWithJoins(
  base: Knex.QueryBuilder,
  employeeId: string,
  query?: string,
): Knex.QueryBuilder {
  return base
    .join(
      CheckListFieldsProperties.tableName,
      `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.checkList_id}`,
      `${CheckListFieldsProperties.tableName}.id`,
    )

    .join(
      QuestionFieldsProperties.tableName,
      `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.checkList_id}`,
      `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.id}`,
    )

    .join(
      EmployeesFields.tableName,
      `${EmployeesFields.tableName}.${EmployeesFields.id}`,
      `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.employee_id}`,
    )
    .join(
      CategoriesFieldsProperties.tableName,
      `${CategoriesFieldsProperties.tableName}.id`,
      `${CheckListItemFieldsProperties.tableName}.${CheckListItemFieldsProperties.categories_id}`,
    )

    .leftJoin(
      ChoicesFieldsProperties.tableName,
      `${ChoicesFieldsProperties.tableName}.question_id`,
      `${QuestionFieldsProperties.tableName}.id`,
    )
    .where((builder: Knex.QueryBuilder<Employee>) => {
      builder.where(
        `${EmployeesFields.tableName}.${EmployeesFields.id}`,
        employeeId,
      );
      builder.where(
        `${CheckListFieldsProperties.tableName}.name`,
        "ilike",
        `%${query}%`,
      );
    })
    .distinct();
}
