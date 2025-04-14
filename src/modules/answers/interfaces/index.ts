import { QuestionType } from "@modules/questions/enums";
import { Anomalies } from "@shared/enums";

export interface multipleChoiceAnswersWithJoin {
  id: string;
  choice_id: string;
  employee_id: number;
  created_at: string;
  updated_at: string;
  answer: string;
  anomalyStatus: Anomalies | null;
  employeeName: string;
  companyName: string;
  question: string;

  question_id: string;
  type: QuestionType;
}
export interface singleQuestionAnswer {
  id: string;
  textAnswer: string | null;
  imageAnswer: string | null;
  question_id: string;
  employee_id: number;
  anomalyStatus: Anomalies | null;
  created_at: string; // ISO string
  updated_at: string; // ISO string
  employeeName: string;
  companyName: string;
  question: string;

  type: QuestionType;
}
