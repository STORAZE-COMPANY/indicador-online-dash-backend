export enum AnswerRoutes {
  baseUrl = "answers",
  getByQuestionId = "answers-question",

  createAnswerForImageQuestion = "answers-image-question",

  createAnswerForMultipleChoiceQuestion = "answers-multiple-choice-question",
}

export enum AnswerSwaggerInfo {
  tags = "Answers",
}

export enum AnswerFieldsProperties {
  tableName = "answers",
  id = "id",
  textAnswer = "textAnswer",

  imageAnswer = "imageAnswer",
  question_id = "question_id",
  employee_id = "employee_id",

  anomalyStatus = "anomalyStatus",
}

export enum AnswerChoiceFieldsProperties {
  tableName = "answerChoice",
  id = "id",
  choice_id = "choice_id",
  employee_id = "employee_id",

  created_at = "created_at",
  updated_at = "updated_at",
}

export enum IaPromptAnswerFieldsProperties {
  tableName = "iaPromptAnswers",
  id = "id",
  textAnswer = "textAnswer",
  answer_id = "answer_id",
}

export enum createAnswerDtoProperties {
  textAnswer = "Resposta da pergunta",
  question_id = "ID da pergunta",
  employee_id = "ID do funcionário",

  imageAnswer = "Imagem contendo a resposta",

  openIaResponse = "Resposta da IA",

  anomaly = "Anomalia (resposta que gera um alerta) podendo ser: ANOMALIA ou ANOMALIA_RESTRITIVA",
}
