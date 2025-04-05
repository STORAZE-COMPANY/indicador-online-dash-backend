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
        isAnomaly: true,
      },
      {
        choice: "Não",
        isAnomaly: false,
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
        isAnomaly: false,
      },
      {
        choice: "Não",
        isAnomaly: true,
      },
      {
        choice: "N/A",
        isAnomaly: true,
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
