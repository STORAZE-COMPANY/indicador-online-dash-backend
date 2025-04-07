import { QuestionType } from "@modules/checklists/enums/question-type.enum";

export class Question {
  id: string;

  question: string;

  type: QuestionType;

  isRequired: boolean;

  checkListItem_id: string;

  IAPrompt: string | null;

  employee_id: string | null;
}
