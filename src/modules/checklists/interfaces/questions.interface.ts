import { AnswerType, QuestionType } from "../enums/question-type.enum";

export interface QuestionsFormatted {
  checkListItem_id: string;
  isRequired: boolean;
  question: string;
  answerType: AnswerType;
  type: QuestionType;

  IAPrompt?: string | null;
}
