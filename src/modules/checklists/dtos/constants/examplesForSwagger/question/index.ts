import {
  AnswerType,
  QuestionType,
} from "@modules/checklists/enums/question-type.enum";
import { Anomalies } from "@shared/enums";

const questionExample01 = [
  {
    question: "O carro está sujo?",
    type: QuestionType.MULTIPLE_CHOICE,
    isRequired: true,
    answerType: AnswerType.TEXT,
    multiple_choice: [
      {
        choice: "Sim",
        anomalyStatus: Anomalies.anomaly,
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
  {
    question: "Placa do carro",
    type: QuestionType.FILE_UPLOAD,
    answerType: AnswerType.IMAGE,
    isRequired: true,
    multiple_choice: [],
    iaPrompt: "",
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
        anomalyStatus: Anomalies.anomaly_restricted,
      },
      {
        choice: "N/A",
        anomalyStatus: Anomalies.anomaly_restricted,
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
