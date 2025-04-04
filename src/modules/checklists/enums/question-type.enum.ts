export enum QuestionType {
  TEXT = "Texto",
  MULTIPLE_CHOICE = "Múltipla escolha",
  FILE_UPLOAD = "Upload de arquivo",
}

export enum CheckListMultipleChoiceFieldsProperties {
  choice = "Escolha",
  isAnomaly = "É anomalia",

  tableName = "questionsChoices",
}
export enum CheckListQuestionFieldsProperties {
  question = "Pergunta",

  list = "Lista de perguntas",

  tableName = "questions",

  type = "Tipo da pergunta",
  isRequired = "É obrigatória",

  created_at = "Data de criação",
  updated_at = "Última atualização",

  checkList_id = "ID do checklist",
}
