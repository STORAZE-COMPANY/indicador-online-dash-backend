export enum QuestionType {
  TEXT = "Texto",
  MULTIPLE_CHOICE = "Múltipla escolha",
  FILE_UPLOAD = "Upload de arquivo",
}

export enum AnswerType {
  TEXT = "Text",
  IMAGE = "Image",
  IA = "IA",
}

export enum CheckListMultipleChoiceFieldsProperties {
  choice = "Escolha",
  isAnomaly = "É anomalia",

  tableName = "questionsChoices",
}
export enum CheckListQuestionFieldsProperties {
  question = "Pergunta",

  list = "Lista de perguntas",

  prompt = "Prompt da IA",

  tableName = "questions",

  type = "Tipo da pergunta",
  isRequired = "É obrigatória",

  created_at = "Data de criação",
  updated_at = "Última atualização",

  answerType = "Tipo de resposta esperada para a pergunta",

  checkList_id = "ID do checklist",
}
