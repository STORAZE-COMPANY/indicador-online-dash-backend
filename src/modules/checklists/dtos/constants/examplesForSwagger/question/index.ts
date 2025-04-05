import { Anomalies } from "@modules/checklists/enums/anomaly.enum";
import {
  AnswerType,
  QuestionType,
} from "@modules/checklists/enums/question-type.enum";

const questionExample01 = [
  {
    question: "O carro está sujo?",
    type: QuestionType.MULTIPLE_CHOICE,
    isRequired: true,
    answerType: AnswerType.TEXT,
    multiple_choice: [
      {
        choice: "Sim",
        anomaly: Anomalies.MEDIUM,
      },
      {
        choice: "Não",
      },
    ],
  },
  {
    question: "Os vidros estão limpos?",
    type: QuestionType.TEXT,
    answerType: AnswerType.TEXT,
    isRequired: true,
    multiple_choice: [],
    iaPrompt:
      'Verifique se de acordo com a resposta do funcionário "Os vidros estão limpos". Caso não esteja, responda: Alerta de anomalia. Caso esteja, responda: Ok.',
  },
];
const questionExample02 = [
  {
    question: "O motor está em bom estado?",
    type: QuestionType.MULTIPLE_CHOICE,
    isRequired: true,
    answerType: AnswerType.TEXT,
    multiple_choice: [
      {
        choice: "Sim",
      },
      {
        choice: "Não",
        anomaly: Anomalies.MEDIUM,
      },
      {
        choice: "N/A",
        anomaly: Anomalies.MEDIUM,
      },
    ],
  },
  {
    question: "O freio está funcionando?",
    type: QuestionType.TEXT,
    answerType: AnswerType.TEXT,
    isRequired: true,
    multiple_choice: [],
    iaPrompt:
      "Verifique se de acordo com a resposta do funcionário o freio está funcionando corretamente. Caso não esteja, responda: Alerta de anomalia. Caso esteja, responda: Ok.",
  },
];

export { questionExample01, questionExample02 };
