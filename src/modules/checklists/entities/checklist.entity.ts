import { QuestionType } from "../enums/question-type.enum";

export class Question {
  questionText: string;
  questionType: QuestionType;
  options: string[];
  isRequired: boolean;
  position: number;
}

export class Category {
  categoryName: string;
  questions: Question[];
}

export class Checklist {
  id: number;
  name: string;
  categories: Category[];
  created_at?: Date;
  updated_at?: Date;
}
