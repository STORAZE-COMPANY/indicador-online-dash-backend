import { Knex } from "knex";
import { Question } from "@modules/questions/entities/question.entity";
import {
  ChoicesFieldsProperties,
  QuestionFieldsProperties,
} from "@modules/questions/enums";

export function generateWhereByCheckListItemBuilder({
  checkListItemId,
}: {
  checkListItemId: string;
}) {
  return (builder: Knex.QueryBuilder<Question>) => {
    builder.where(QuestionFieldsProperties.checkList_id, checkListItemId);
  };
}

/**
 * Gera uma lista de seleções para consulta de questões no banco de dados.
 *
 * @returns {string[]} Um array de strings representando os campos selecionados,
 * incluindo alias para facilitar a identificação:
 * - `question_id`: ID da questão.
 * - `checkList_id`: ID do checklist associado.
 * - `IA_prompt`: Prompt de IA associado à questão.
 * - `is_required`: Indica se a questão é obrigatória.
 * - `question_text`: Texto da questão.
 * - `question_type`: Tipo da questão.
 */
export function generateQuestionSelect() {
  return [
    `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.id} as question_id`,
    `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.checkList_id} as checkList_id`,
    `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.IAPrompt} as IA_prompt`,
    `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.isRequired} as is_required`,
    `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.question} as question_text`,
    `${QuestionFieldsProperties.tableName}.${QuestionFieldsProperties.type} as question_type`,
  ];
}
/**
 * Gera uma lista de seleções formatadas para serem usadas em consultas SQL.
 * Cada item da lista representa um campo da tabela de escolhas (choices),
 * com alias específicos para facilitar o mapeamento dos dados retornados.
 *
 * @returns {string[]} Uma lista de strings representando os campos selecionados
 * com seus respectivos aliases.
 */
export function generateChoicesSelect() {
  return [
    `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.id} as choice_id`,
    `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.question_id} as choice_question_id`,
    `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.choice} as choice_text`,
    `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.anomaly} as choice_anomaly`,
    `${ChoicesFieldsProperties.tableName}.${ChoicesFieldsProperties.createdAt} as choice_created_at`,
  ];
}
