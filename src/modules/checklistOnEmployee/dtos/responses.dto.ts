import { QuestionType } from "@modules/questions/enums";
import { ApiProperty } from "@nestjs/swagger";
import { Anomalies, QuestionAnswerType } from "@shared/enums";
import { IsString } from "class-validator";

export class CheckListForSpecificEmployee {
  @ApiProperty({
    description: "ID da tabela auxiliar",
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: "ID do checklist",
  })
  checklistId: string;

  @ApiProperty({
    description: "Nome do checklist",
  })
  @IsString()
  checklistName: string;
}
export class Answers {
  @ApiProperty({
    description: "ID da resposta",
  })
  answerId: string;

  @ApiProperty({
    description: "Resposta da questão em texto",
  })
  textAnswer?: string;

  @ApiProperty({
    description: "Resposta da questão em arquivo",
  })
  imageAnswer?: string;

  @ApiProperty({
    description: "Anomalia da resposta",
    enum: Anomalies,
  })
  anomalyStatus?: Anomalies;
}
export class QuestionResponse extends Answers {
  @ApiProperty({
    description: "ID da questão",
  })
  id: string;
  @ApiProperty({
    description: "Questão",
  })
  question: string;
  @ApiProperty({
    description: "Tipo de resposta da questão",
    enum: [
      QuestionType.FILE_UPLOAD,
      QuestionType.MULTIPLE_CHOICE,
      QuestionType.TEXT,
    ],
  })
  type: QuestionType;

  @ApiProperty({
    description: "Se a questão é obrigatória",
  })
  isRequired: boolean;

  @ApiProperty({
    description: "ID do checklist",
  })
  checklist_id: string;

  @ApiProperty({
    description: "Prompt da IA",
    nullable: true,
    type: String,
  })
  IAPrompt?: string;

  @ApiProperty({
    description: "ID do funcionário",
  })
  employee_id?: number;

  @ApiProperty({
    description: "ID da categoria",
  })
  category_id: string;

  @ApiProperty({
    description: "Tipo de resposta da questão",
    enum: QuestionAnswerType,
  })
  answerType: QuestionAnswerType;
}
export class QuestionsWithFlagAnswer extends QuestionResponse {
  @ApiProperty({
    description: "Se a questão já foi respondida",
  })
  alreadyAnswered: boolean;
}
export class ChecklistOnEmployeeWithQuestionsResponse {
  @ApiProperty({
    description: "ID da tabela auxiliar",
  })
  id: string;

  @ApiProperty({
    description: "ID do funcionário",
  })
  employee_id: number;

  @ApiProperty({
    description: "ID do checklist",
  })
  checklist_id: string;

  @ApiProperty({
    description: "Nome do checklist",
  })
  checklistName: string;
  @ApiProperty({
    description: "Data de atualização",
  })
  updated_at: string;
  @ApiProperty({
    description: "Data de criação",
  })
  created_at: string;

  @ApiProperty({
    description: "Checklist para funcionário",
    type: () => [CheckListForSpecificEmployee],
    isArray: true,
  })
  questions: QuestionsWithFlagAnswer[];
}
