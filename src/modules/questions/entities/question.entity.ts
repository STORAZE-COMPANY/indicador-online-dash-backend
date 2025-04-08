import { QuestionType } from "@modules/checklists/enums/question-type.enum";
import { QuestionAnswerType } from "@shared/enums";

export class Question {
  id: string;

  question: string;

  type: QuestionType;

  isRequired: boolean;

  checkListItem_id: string;

  IAPrompt: string | null;

  employee_id: number | null;

  answerType: QuestionAnswerType;
}
