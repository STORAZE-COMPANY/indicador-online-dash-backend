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
    .returning(["id", "categories_id", "checkList_id"]);

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
    isAnomaly: boolean;
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
        isAnomaly: choice.isAnomaly,
        question_id: item.id,
      })),
    )
    .flat();
}
