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
}

enum ChoicesFieldsProperties {
  tableName = "questionsChoices",
  id = "id",
  choice = "choice",
  question_id = "question_id",
  anomaly = "anomaly",
  createdAt = "created_at",
}

enum QuestionsRoutes {
  baseUrl = "questions",
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
