export enum AnswerRoutes {
  baseUrl = "answers",
  getByQuestionId = "answers-question",
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

export enum createAnswerDtoProperties {
  textAnswer = "Resposta da pergunta",
  question_id = "ID da pergunta",
  employee_id = "ID do funcionário",

  imageAnswer = "Imagem contendo a resposta",

  anomaly = "Anomalia (resposta que gera um alerta) podendo ser: ANOMALIA ou ANOMALIA_RESTRITIVA",
}
