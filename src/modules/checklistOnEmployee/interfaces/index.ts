import { Question } from "@modules/questions/entities/question.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Anomalies } from "@shared/enums";

export interface ChecklistOnEmployeeWithQuestions {
  id: string;
  employee_id: number;
  checklist_id: string;

  checklistName: string;

  updated_at: string;
  created_at: string;

  questions: Question[];
}

class AnswerOnQuestion {
  @ApiProperty({
    description: "ID da resposta",
  })
  answerId: string;
  @ApiProperty({
    description: "Texto da resposta",
  })
  answer: string;

  @ApiProperty({
    description: "ID da resposta",
    enum: Anomalies,
    required: false,
  })
  AnomalyStatus?: Anomalies;
}
class QuestionGrouped {
  @ApiProperty({
    description: "ID da questão",
  })
  questionId: string;
  @ApiProperty({
    description: "Nome da questão",
  })
  question: string;
  @ApiProperty({
    description: "Se a questão já foi respondida",
  })
  answered: boolean;

  @ApiProperty({
    description: "Respostas da questão",
    type: AnswerOnQuestion,
  })
  answers?: AnswerOnQuestion;
}
export class checklistsWithQuestions {
  checkListId: string;
  checkListName: string;
  question: string;
  questionId: string;

  answered: boolean;

  answerId: string;

  textAnswer?: string;
  imageAnswer?: string;

  answerChoiceId?: string;
  choiceId?: string;

  choice?: string;
  anomalyStatus?: Anomalies;
  anomalyChoiceStatus?: Anomalies;
}

export class checklistsWithQuestionsGrouped {
  @ApiProperty({
    description: "ID do checklist",
  })
  checkListId: string;

  @ApiProperty({
    description: "Nome do checklist",
  })
  checkListName: string;

  @ApiProperty({
    description: "Questões do checklist",
    type: () => [QuestionGrouped],
    isArray: true,
  })
  questions: QuestionGrouped[];
}
