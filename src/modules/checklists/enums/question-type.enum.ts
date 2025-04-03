export enum QuestionType {
  TEXT = "Texto",
  MULTIPLE_CHOICE = "Múltipla escolha",
  FILE_UPLOAD = "Upload de arquivo",
}

export enum CheckListResponseMessages {
  notFound = "CheckList não encontrada",
}
export enum CheckListFieldsProperties {
  tableName = "checkList",

  name = "Nome do checklist",
  id = "ID da empresa",
  expiries_in = "Data de expiração",

  created_at = "Data de criação",
  updated_at = "Última atualização",
  categories_id = "ID da categoria",

  question_list = "Lista de perguntas",
}
export enum CheckListQuestionFieldsProperties {
  question = "Pergunta",

  tableName = "questions",

  type = "Tipo da pergunta",
  isRequired = "É obrigatória",

  created_at = "Data de criação",
  updated_at = "Última atualização",

  checkList_id = "ID do checklist",
}
