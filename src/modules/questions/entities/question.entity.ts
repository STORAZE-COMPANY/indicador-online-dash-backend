import { QuestionAnswerType } from "@shared/enums";
import { QuestionType } from "../enums";

export class Question {
  id: string;

  question: string;

  type: QuestionType;

  isRequired: boolean;

  checklist_id: string;

  IAPrompt: string | null;

  category_id: string;

  answerType: QuestionAnswerType;
}
