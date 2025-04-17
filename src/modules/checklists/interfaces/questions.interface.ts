import { CheckListMultipleChoiceDto } from "../dtos/question.dto";
import { AnswerType, QuestionType } from "../enums/question-type.enum";

export interface QuestionsFormatted {
  checklist_id: string;
  isRequired: boolean;
  question: string;
  answerType: AnswerType;
  type: QuestionType;

  category_id: string;

  IAPrompt?: string | null;
}
export interface ICheckListQuestions {
  question: string;

  category_id: string;
  answerType: AnswerType;
  type: QuestionType;
  isRequired: boolean;
  iaPrompt?: string;
  multiple_choice?: CheckListMultipleChoiceDto[];
}
