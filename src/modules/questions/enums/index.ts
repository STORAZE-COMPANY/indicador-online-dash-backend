enum QuestionType {
  TEXT = "Texto",
  MULTIPLE_CHOICE = "Múltipla escolha",
  FILE_UPLOAD = "Upload de arquivo",
}

enum QuestionFieldsProperties {
  tableName = "questions",
  id = "id",
  question = "question",
  type = "type",
  isRequired = "isRequired",
  checkList_id = "checkListItem_id",
  IAPrompt = "IAPrompt",

  employee_id = "employee_id",

  answerType = "answerType",

  choices = "Caso tenha múltipla escolha, as opções de resposta",
}

enum ChoicesFieldsProperties {
  tableName = "questionsChoices",
  id = "id",
  choice = "choice",
  question_id = "question_id",
  anomaly = "anomalyStatus",
  createdAt = "created_at",
}

enum QuestionsRoutes {
  baseUrl = "questions",

  findAll = "findAll",
}

enum QuestionsSwaggerInfo {
  tags = "Questions",
}

export {
  QuestionType,
  QuestionFieldsProperties,
  ChoicesFieldsProperties,
  QuestionsRoutes,
  QuestionsSwaggerInfo,
};
